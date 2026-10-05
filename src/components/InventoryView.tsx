import React, { useState } from 'react';
import {
  ComponentItem,
  ComponentCategory,
  ComponentCondition,
} from '../types';
import { QUICK_ADD_PRESETS } from '../data/initialData';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Box,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Scale,
} from 'lucide-react';

interface InventoryViewProps {
  inventory: ComponentItem[];
  onAddComponent: (item: Omit<ComponentItem, 'id' | 'dateAdded'>) => void;
  onUpdateComponent: (id: string, updates: Partial<ComponentItem>) => void;
  onDeleteComponent: (id: string) => void;
  onRestoreDefaults: () => void;
}

const CATEGORIES: (ComponentCategory | 'All')[] = [
  'All',
  'Microcontroller',
  'Sensor',
  'Actuator',
  'Display',
  'Power',
  'Passive',
];

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onAddComponent,
  onUpdateComponent,
  onDeleteComponent,
  onRestoreDefaults,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'All'>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('Microcontroller');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<ComponentCondition>('Working');
  const [weight, setWeight] = useState(25);
  const [notes, setNotes] = useState('');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(1);
  const [editWeight, setEditWeight] = useState(10);
  const [editCondition, setEditCondition] = useState<ComponentCondition>('Working');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddComponent({
      name: name.trim(),
      category,
      quantity: Math.max(1, quantity),
      condition,
      estimatedWeightGrams: Math.max(1, weight),
      notes: notes.trim(),
    });

    // Reset Form
    setName('');
    setQuantity(1);
    setWeight(20);
    setNotes('');
    setIsFormOpen(false);
  };

  const handleStartEdit = (item: ComponentItem) => {
    setEditingId(item.id);
    setEditQty(item.quantity);
    setEditWeight(item.estimatedWeightGrams);
    setEditCondition(item.condition);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateComponent(id, {
      quantity: Math.max(1, editQty),
      estimatedWeightGrams: Math.max(1, editWeight),
      condition: editCondition,
    });
    setEditingId(null);
  };

  // Filtered inventory
  const filteredItems = inventory.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalParts = inventory.reduce((acc, i) => acc + i.quantity, 0);
  const totalWeight = inventory.reduce((acc, i) => acc + i.estimatedWeightGrams * i.quantity, 0);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header & Metric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8D5A44] mb-1">
            <Box className="w-3.5 h-3.5 text-[#8D5A44]" />
            <span className="uppercase tracking-wider font-mono text-[11px] font-bold">
              Hardware Component Inventory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal font-display text-[#1F211F] tracking-tight">
            Component Inventory Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#535550] mt-1">
            Catalog and audit your discrete electronics to automatically sync with blueprint feasibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D5A44]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isFormOpen ? 'Close Form' : 'Log New Component'}</span>
          </button>

          <button
            onClick={onRestoreDefaults}
            title="Restore sample starter components"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1F211F] hover:text-[#8D5A44] bg-[#FAF8F2] hover:bg-[#F2ECE1] border border-[#DCD6C9] rounded-lg shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs">
        <div>
          <span className="text-xs text-[#62635D] font-medium">Total Unique Items</span>
          <p className="text-lg font-bold font-display text-[#1F211F] font-mono tabular-nums mt-0.5">
            {inventory.length}
          </p>
        </div>
        <div>
          <span className="text-xs text-[#62635D] font-medium">Total Units / Count</span>
          <p className="text-lg font-bold font-display text-[#1F211F] font-mono tabular-nums mt-0.5">
            {totalParts}
          </p>
        </div>
        <div>
          <span className="text-xs text-[#62635D] font-medium">Total Logged Weight</span>
          <p className="text-lg font-bold font-display text-[#2E5E4E] font-mono tabular-nums mt-0.5">
            {totalWeight}g
          </p>
        </div>
        <div>
          <span className="text-xs text-[#62635D] font-medium">Salvaged Parts Ratio</span>
          <p className="text-lg font-bold font-display text-[#8D5A44] font-mono tabular-nums mt-0.5">
            {totalParts > 0
              ? `${Math.round(
                  (inventory
                    .filter((i) => i.condition === 'Salvaged')
                    .reduce((a, b) => a + b.quantity, 0) /
                    totalParts) *
                    100
                )}%`
              : '0%'}
          </p>
        </div>
      </div>

      {/* Quick Add Presets Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#1F211F] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8D5A44]" />
            <span>Quick-Add Common Components (1-Click Test)</span>
          </span>
          <span className="text-[11px] text-[#73756F]">Click to instantly increment/add</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5">
          {QUICK_ADD_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onAddComponent(preset)}
              className="group shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FFFFFF] hover:bg-[#FAF8F2] text-[#1F211F] hover:text-[#8D5A44] border border-[#E2DDD4] shadow-xs hover:border-[#8D5A44]/40 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3 h-3 text-[#8D5A44] group-hover:scale-125 transition-transform" />
              <span>{preset.name}</span>
              <span className="text-[10px] text-[#73756F] font-mono">({preset.estimatedWeightGrams}g)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Component Collapsible Drawer Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-[#EAE4D7] pb-3">
            <h2 className="text-base font-normal font-display text-[#1F211F] flex items-center gap-2">
              <Box className="w-4 h-4 text-[#8D5A44]" />
              <span>Catalog New Electronic Component</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-[#73756F] hover:text-[#1F211F]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1F211F] mb-1">
                Component Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Arduino Uno R3, 16x2 LCD..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] placeholder-[#8A8B84] focus:outline-none focus:border-[#8D5A44] focus:ring-1 focus:ring-[#8D5A44]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1F211F] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComponentCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] focus:outline-none focus:border-[#8D5A44]"
              >
                <option value="Microcontroller">Microcontroller</option>
                <option value="Sensor">Sensor</option>
                <option value="Actuator">Actuator (Motor, Buzzer, Relay)</option>
                <option value="Display">Display / LED</option>
                <option value="Power">Power / Battery / Cell</option>
                <option value="Passive">Passive (Resistor, Cap, Wire)</option>
                <option value="Communication">Communication (Bluetooth, RF)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1F211F] mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] font-mono focus:outline-none focus:border-[#8D5A44]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1F211F] mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ComponentCondition)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] focus:outline-none focus:border-[#8D5A44]"
              >
                <option value="Working">Working / Tested</option>
                <option value="Salvaged">Salvaged (Reclaimed E-Waste)</option>
                <option value="New">New / Unused</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1F211F] mb-1">
                Estimated Weight (grams per unit)
              </label>
              <input
                type="number"
                min="1"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] font-mono focus:outline-none focus:border-[#8D5A44]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1F211F] mb-1">
                Salvage Notes / Pinout (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Reclaimed from broken microwave display"
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF8F2] border border-[#DCD6C9] text-[#1F211F] placeholder-[#8A8B84] focus:outline-none focus:border-[#8D5A44]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3.5 py-2 text-xs text-[#535550] hover:text-[#1F211F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg shadow-sm transition-colors"
            >
              Save to Inventory
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8A8B84] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parts by name, category, notes..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#FFFFFF] border border-[#DCD6C9] text-[#1F211F] placeholder-[#8A8B84] focus:outline-none focus:border-[#8D5A44] shadow-xs"
          />
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#F2EDE2] rounded-lg border border-[#E0D9CC]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1F211F] text-[#FAF8F2] font-semibold shadow-xs'
                  : 'text-[#535550] hover:text-[#1F211F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid / Table */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#FFFFFF] border border-[#E2DDD4] shadow-xs space-y-3">
          <Box className="w-10 h-10 text-[#8A8B84] mx-auto stroke-[1.5]" />
          <h3 className="text-base font-normal font-display text-[#1F211F]">No components found</h3>
          <p className="text-xs text-[#62635D] max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try relaxing your filter or search term to view items.'
              : 'Your component drawer is currently empty. Add your first electronic component above!'}
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold font-display text-[#FAF8F2] bg-[#1F211F] hover:bg-[#8D5A44] rounded-lg shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Component Now</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E2DDD4] bg-[#FFFFFF] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2EDE2] text-[#1F211F] font-semibold border-b border-[#E2DDD4] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Component Details</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Condition</th>
                  <th className="py-3 px-3 text-right">Unit Wt.</th>
                  <th className="py-3 px-3 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D7]">
                {filteredItems.map((item) => {
                  const isEditing = editingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#FAF8F2] transition-colors group"
                    >
                      {/* Name & Notes */}
                      <td className="py-3 px-4 min-w-[200px]">
                        <div className="font-semibold text-[#1F211F]">{item.name}</div>
                        {item.notes && (
                          <div className="text-[11px] text-[#62635D] mt-0.5 truncate max-w-xs">
                            {item.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-[#535550] font-medium">
                          {item.category}
                        </span>
                      </td>

                      {/* Condition */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={editCondition}
                            onChange={(e) =>
                              setEditCondition(e.target.value as ComponentCondition)
                            }
                            className="bg-[#FAF8F2] border border-[#DCD6C9] text-xs rounded px-1.5 py-0.5 text-[#1F211F]"
                          >
                            <option value="Working">Working</option>
                            <option value="Salvaged">Salvaged</option>
                            <option value="New">New</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              item.condition === 'Salvaged'
                                ? 'bg-[#8D5A44]/15 text-[#8D5A44] border-[#8D5A44]/30'
                                : item.condition === 'Working'
                                ? 'bg-[#2E5E4E]/15 text-[#2E5E4E] border-[#2E5E4E]/30'
                                : 'bg-[#C47D3B]/15 text-[#C47D3B] border-[#C47D3B]/30'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {item.condition}
                          </span>
                        )}
                      </td>

                      {/* Weight */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            min="1"
                            value={editWeight}
                            onChange={(e) => setEditWeight(parseInt(e.target.value) || 1)}
                            className="w-14 bg-[#FAF8F2] border border-[#DCD6C9] text-right px-1 text-[#1F211F] rounded font-mono"
                          />
                        ) : (
                          <span className="text-[#535550] font-medium">
                            {item.estimatedWeightGrams}g
                          </span>
                        )}
                      </td>

                      {/* Quantity with quick +/- */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                onUpdateComponent(item.id, { quantity: item.quantity - 1 });
                              } else {
                                onDeleteComponent(item.id);
                              }
                            }}
                            title="Decrease quantity"
                            className="w-6 h-6 rounded bg-[#F2EDE2] hover:bg-[#EAE4D7] text-[#1F211F] hover:text-[#8D5A44] flex items-center justify-center font-mono font-bold text-xs border border-[#DCD6C9]"
                          >
                            -
                          </button>

                          <span className="w-8 text-center font-mono font-bold text-[#1F211F] tabular-nums">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              onUpdateComponent(item.id, { quantity: item.quantity + 1 })
                            }
                            title="Increase quantity"
                            className="w-6 h-6 rounded bg-[#F2EDE2] hover:bg-[#EAE4D7] text-[#1F211F] hover:text-[#8D5A44] flex items-center justify-center font-mono font-bold text-xs border border-[#DCD6C9]"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="p-1 rounded bg-[#1F211F] text-[#FAF8F2] hover:bg-[#8D5A44]"
                              title="Save changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded bg-[#F2EDE2] text-[#535550] hover:text-[#1F211F]"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEdit(item)}
                              title="Edit item details"
                              className="p-1.5 rounded hover:bg-[#F2EDE2] text-[#62635D] hover:text-[#1F211F]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteComponent(item.id)}
                              title="Delete component"
                              className="p-1.5 rounded hover:bg-rose-50 text-[#8A8B84] hover:text-rose-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
