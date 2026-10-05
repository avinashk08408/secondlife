export type ComponentCategory =
  | 'Microcontroller'
  | 'Sensor'
  | 'Actuator'
  | 'Display'
  | 'Power'
  | 'Passive'
  | 'Communication'
  | 'Other';

export type ComponentCondition = 'New' | 'Working' | 'Salvaged';

export interface ComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  quantity: number;
  condition: ComponentCondition;
  estimatedWeightGrams: number;
  notes?: string;
  dateAdded: string;
}

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProjectCategory =
  | 'Robotics'
  | 'Home Automation'
  | 'Green Tech'
  | 'Instruments & Clocks'
  | 'Lighting'
  | 'Wearables';

export interface RequiredComponent {
  name: string;
  category: ComponentCategory;
  requiredQuantity: number;
  aliases: string[];
  salvageTip?: string;
  buyEstimatedCost?: string;
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  pinWiringTip?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProjectCategory;
  difficulty: ProjectDifficulty;
  estimatedBuildTimeMinutes: number;
  image: string;
  requiredComponents: RequiredComponent[];
  steps: ProjectStep[];
  environmentalImpact: {
    divertedGrams: number;
    preventedCo2Kg: number;
  };
  toolsNeeded: string[];
  isCompleted?: boolean;
  completedAt?: string;
}

export interface ComponentMatchStatus {
  required: RequiredComponent;
  isSatisfied: boolean;
  ownedQuantity: number;
  matchedComponent?: ComponentItem;
}

export interface ProjectFeasibilityResult {
  project: Project;
  totalRequired: number;
  satisfiedCount: number;
  feasibilityPercent: number;
  matchStatuses: ComponentMatchStatus[];
  isFullyReady: boolean;
}

export interface CompletedProjectLog {
  id: string;
  projectId: string;
  projectTitle: string;
  completedAt: string;
  componentsUsedCount: number;
  divertedGrams: number;
  preventedCo2Kg: number;
}

export interface CommunityBadge {
  id: string;
  name: string;
  description: string;
  iconName: 'Cpu' | 'Award' | 'Leaf' | 'Wrench' | 'Zap' | 'ShieldCheck';
  unlocked: boolean;
  unlockProgress: number; // 0 to 100
  requirementText: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}
