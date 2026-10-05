/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ComponentItem,
  Project,
  ProjectFeasibilityResult,
  CompletedProjectLog,
  ToastMessage,
  RequiredComponent,
} from './types';
import { INITIAL_INVENTORY, INITIAL_PROJECTS } from './data/initialData';
import {
  calculateProjectFeasibility,
  evaluateBadges,
  calculateImpactMetrics,
} from './utils/feasibility';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { InventoryView } from './components/InventoryView';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { SustainabilityView } from './components/SustainabilityView';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

const STORAGE_KEY_INVENTORY = 'secondlife_inventory_v1';
const STORAGE_KEY_LOGS = 'secondlife_completed_logs_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'inventory' | 'projects' | 'sustainability'>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  // Inventory state with localStorage persistence
  const [inventory, setInventory] = useState<ComponentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVENTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback on storage errors
    }
    return INITIAL_INVENTORY;
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  // Completed logs state
  const [completedLogs, setCompletedLogs] = useState<CompletedProjectLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback
    }
    return [
      {
        id: 'log-seed-1',
        projectId: 'proj-ultrasonic-radar',
        projectTitle: 'Ultrasonic Distance Radar & Obstacle Detector',
        completedAt: '2026-04-03',
        componentsUsedCount: 5,
        divertedGrams: 54,
        preventedCo2Kg: 0.76,
      },
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      // Ignore quota errors
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(completedLogs));
    } catch (e) {
      // Ignore
    }
  }, [completedLogs]);

  // Toast dispatcher
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Real-time Feasibility Engine derivation
  const feasibilityResults: ProjectFeasibilityResult[] = useMemo(() => {
    return projects.map((proj) => calculateProjectFeasibility(proj, inventory));
  }, [projects, inventory]);

  // Community Badges derivation
  const badges = useMemo(() => {
    return evaluateBadges(inventory, completedLogs, feasibilityResults);
  }, [inventory, completedLogs, feasibilityResults]);

  // Impact metrics derivation
  const impactMetrics = useMemo(() => {
    return calculateImpactMetrics(inventory, completedLogs);
  }, [inventory, completedLogs]);

  // Active selected project modal result
  const selectedFeasibilityResult = useMemo(() => {
    if (!selectedProjectId) return null;
    return feasibilityResults.find((r) => r.project.id === selectedProjectId) || null;
  }, [selectedProjectId, feasibilityResults]);

  // Handlers for Inventory
  const handleAddComponent = (item: Omit<ComponentItem, 'id' | 'dateAdded'>) => {
    // Check if an item with the same name already exists
    const existingIndex = inventory.findIndex(
      (i) => i.name.toLowerCase() === item.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Increment existing
      const updated = [...inventory];
      updated[existingIndex].quantity += item.quantity;
      setInventory(updated);
      addToast(
        'Inventory Updated',
        `Incremented ${item.name} quantity to ${updated[existingIndex].quantity}.`,
        'success'
      );
    } else {
      // Add new
      const newItem: ComponentItem = {
        ...item,
        id: `comp-${Date.now()}`,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setInventory((prev) => [newItem, ...prev]);
      addToast(
        'Component Cataloged',
        `Added ${newItem.quantity}x ${newItem.name} (${newItem.estimatedWeightGrams}g) to drawer.`,
        'success'
      );
    }
  };

  const handleUpdateComponent = (id: string, updates: Partial<ComponentItem>) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('Component Saved', 'Inventory item details updated successfully.', 'info');
  };

  const handleDeleteComponent = (id: string) => {
    const target = inventory.find((i) => i.id === id);
    setInventory((prev) => prev.filter((i) => i.id !== id));
    if (target) {
      addToast('Component Removed', `Removed ${target.name} from your inventory.`, 'warning');
    }
  };

  const handleRestoreDefaults = () => {
    setInventory(INITIAL_INVENTORY);
    addToast(
      'Starter Inventory Loaded',
      'Restored sample components (Arduino Uno, Ultrasonic Sensor, Servo, LCD, etc.).',
      'info'
    );
  };

  // Add missing component directly from modal
  const handleAddMissingComponentFromModal = (required: RequiredComponent) => {
    handleAddComponent({
      name: required.name,
      category: required.category,
      quantity: required.requiredQuantity,
      condition: 'Working',
      estimatedWeightGrams: 20,
      notes: required.salvageTip || 'Acquired for project build',
    });
  };

  // Quick-stock all missing components for a project
  const handleQuickAddMissingForProject = (projectId: string) => {
    const result = feasibilityResults.find((r) => r.project.id === projectId);
    if (!result) return;

    let addedCount = 0;
    result.matchStatuses.forEach((status) => {
      if (!status.isSatisfied) {
        const neededQty = status.required.requiredQuantity - status.ownedQuantity;
        handleAddComponent({
          name: status.required.name,
          category: status.required.category,
          quantity: Math.max(1, neededQty),
          condition: 'Working',
          estimatedWeightGrams: 20,
          notes: status.required.salvageTip,
        });
        addedCount++;
      }
    });

    addToast(
      'Quick-Stock Complete',
      `Cataloged missing components for ${result.project.title}. Project is now 100% ready!`,
      'success'
    );
  };

  // Mark project as built
  const handleMarkAsBuilt = (projectId: string) => {
    const result = feasibilityResults.find((r) => r.project.id === projectId);
    if (!result) return;

    const newLog: CompletedProjectLog = {
      id: `log-${Date.now()}`,
      projectId,
      projectTitle: result.project.title,
      completedAt: new Date().toISOString().split('T')[0],
      componentsUsedCount: result.totalRequired,
      divertedGrams: result.project.environmentalImpact.divertedGrams,
      preventedCo2Kg: result.project.environmentalImpact.preventedCo2Kg,
    };

    setCompletedLogs((prev) => [newLog, ...prev]);

    // Mark project as completed in project state
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, isCompleted: true, completedAt: newLog.completedAt } : p
      )
    );

    addToast(
      '🎉 Project Marked as Built!',
      `Diverted ${newLog.divertedGrams}g of e-waste and prevented ${newLog.preventedCo2Kg}kg of CO₂ emissions.`,
      'success'
    );

    setSelectedProjectId(null);
  };

  const readyProjectsCount = feasibilityResults.filter((f) => f.feasibilityPercent === 100).length;

  return (
    <div className="min-h-screen transition-colors duration-500 flex flex-col bg-[#FAF8F2] text-[#1F211F] selection:bg-[#8D5A44]/20 selection:text-[#1F211F]">
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inventoryCount={inventory.reduce((acc, i) => acc + i.quantity, 0)}
        readyProjectsCount={readyProjectsCount}
        onOpenAddComponent={() => {
          setActiveTab('inventory');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeView
            inventory={inventory}
            feasibilityResults={feasibilityResults}
            completedLogs={completedLogs}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onOpenAddComponent={() => setActiveTab('inventory')}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            inventory={inventory}
            onAddComponent={handleAddComponent}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
            onRestoreDefaults={handleRestoreDefaults}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            feasibilityResults={feasibilityResults}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onQuickAddMissing={handleQuickAddMissingForProject}
          />
        )}

        {activeTab === 'sustainability' && (
          <SustainabilityView
            inventory={inventory}
            completedLogs={completedLogs}
            feasibilityResults={feasibilityResults}
            badges={badges}
            onNavigateToProjects={() => setActiveTab('projects')}
          />
        )}
      </main>

      {/* Project Feasibility & Details Modal */}
      {selectedProjectId && (
        <ProjectDetailModal
          feasibilityResult={selectedFeasibilityResult}
          onClose={() => setSelectedProjectId(null)}
          onAddMissingComponent={handleAddMissingComponentFromModal}
          onMarkAsBuilt={handleMarkAsBuilt}
        />
      )}

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
