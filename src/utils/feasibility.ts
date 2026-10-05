import {
  ComponentItem,
  Project,
  ProjectFeasibilityResult,
  ComponentMatchStatus,
  RequiredComponent,
  CompletedProjectLog,
  CommunityBadge,
} from '../types';

/**
 * Normalizes a string for flexible hardware component matching
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if a required component is satisfied by any owned component
 */
export function matchComponent(
  required: RequiredComponent,
  inventory: ComponentItem[]
): ComponentMatchStatus {
  const normReqName = normalizeString(required.name);
  const normAliases = required.aliases.map(normalizeString);

  // Find candidate matches in inventory
  let matchingItems = inventory.filter((item) => {
    const normItemName = normalizeString(item.name);

    // Direct substring or exact name match
    if (
      normItemName.includes(normReqName) ||
      normReqName.includes(normItemName)
    ) {
      return true;
    }

    // Check alias matching
    for (const alias of normAliases) {
      if (alias.length > 2 && (normItemName.includes(alias) || alias.includes(normItemName))) {
        return true;
      }
    }

    // If categories match and name tokens overlap significantly
    if (item.category === required.category) {
      const itemTokens = normItemName.split(' ');
      const reqTokens = normReqName.split(' ');
      const common = reqTokens.filter((token) => token.length > 2 && itemTokens.includes(token));
      if (common.length > 0) {
        return true;
      }
    }

    return false;
  });

  const totalOwnedQty = matchingItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const isSatisfied = totalOwnedQty >= required.requiredQuantity;

  return {
    required,
    isSatisfied,
    ownedQuantity: totalOwnedQty,
    matchedComponent: matchingItems[0],
  };
}

/**
 * Computes feasibility score and itemized match breakdown for a project
 */
export function calculateProjectFeasibility(
  project: Project,
  inventory: ComponentItem[]
): ProjectFeasibilityResult {
  const matchStatuses: ComponentMatchStatus[] = project.requiredComponents.map(
    (req) => matchComponent(req, inventory)
  );

  const totalRequired = matchStatuses.length;
  const satisfiedCount = matchStatuses.filter((s) => s.isSatisfied).length;
  const feasibilityPercent =
    totalRequired > 0 ? Math.round((satisfiedCount / totalRequired) * 100) : 0;

  return {
    project,
    totalRequired,
    satisfiedCount,
    feasibilityPercent,
    matchStatuses,
    isFullyReady: feasibilityPercent === 100,
  };
}

/**
 * Calculates environmental sustainability metrics
 * Ratio: 1 kg e-waste diverted ≈ 14 kg CO2 emissions prevented
 */
export function calculateImpactMetrics(
  inventory: ComponentItem[],
  completedLogs: CompletedProjectLog[]
) {
  // Sum weight of all logged items (salvaged + working + new components kept out of landfill)
  const inventoryWeightGrams = inventory.reduce(
    (acc, item) => acc + item.estimatedWeightGrams * item.quantity,
    0
  );

  // Sum weight of completed project builds
  const completedBuildsWeightGrams = completedLogs.reduce(
    (acc, log) => acc + log.divertedGrams,
    0
  );

  const totalDivertedGrams = inventoryWeightGrams + completedBuildsWeightGrams;
  const totalDivertedKg = totalDivertedGrams / 1000;
  
  // 1 kg e-waste ≈ 14 kg CO2
  const totalCo2PreventedKg = parseFloat((totalDivertedKg * 14).toFixed(2));

  // Monthly target: 2500 grams (2.5 kg)
  const monthlyTargetGrams = 2500;
  const targetProgressPercent = Math.min(
    100,
    Math.round((totalDivertedGrams / monthlyTargetGrams) * 100)
  );

  return {
    inventoryWeightGrams,
    completedBuildsWeightGrams,
    totalDivertedGrams,
    totalDivertedKg: parseFloat(totalDivertedKg.toFixed(2)),
    totalCo2PreventedKg,
    monthlyTargetGrams,
    targetProgressPercent,
  };
}

/**
 * Computes dynamically updated community badges based on current platform activity
 */
export function evaluateBadges(
  inventory: ComponentItem[],
  completedLogs: CompletedProjectLog[],
  feasibilityResults: ProjectFeasibilityResult[]
): CommunityBadge[] {
  const salvagedCount = inventory
    .filter((i) => i.condition === 'Salvaged')
    .reduce((acc, i) => acc + i.quantity, 0);

  const has100PercentProject = feasibilityResults.some((r) => r.feasibilityPercent === 100);

  const totalGrams = inventory.reduce(
    (acc, item) => acc + item.estimatedWeightGrams * item.quantity,
    0
  );

  const totalCo2 = (totalGrams / 1000) * 14;

  return [
    {
      id: 'badge-circuit-rescuer',
      name: 'Circuit Rescuer',
      description: 'Inventory at least 3 salvaged components from discarded electronics.',
      iconName: 'Cpu',
      unlocked: salvagedCount >= 3,
      unlockProgress: Math.min(100, Math.round((salvagedCount / 3) * 100)),
      requirementText: `${salvagedCount} / 3 salvaged components logged`,
    },
    {
      id: 'badge-feasibility-ready',
      name: 'Feasibility Master',
      description: 'Reach 100% component readiness on at least one project build.',
      iconName: 'ShieldCheck',
      unlocked: has100PercentProject,
      unlockProgress: has100PercentProject ? 100 : 60,
      requirementText: has100PercentProject ? '100% Feasibility Achieved' : 'Need 1 ready project',
    },
    {
      id: 'badge-ewaste-warrior',
      name: 'E-Waste Warrior',
      description: 'Log and catalog at least 150g of electronic components.',
      iconName: 'Award',
      unlocked: totalGrams >= 150,
      unlockProgress: Math.min(100, Math.round((totalGrams / 150) * 100)),
      requirementText: `${Math.round(totalGrams)}g / 150g logged`,
    },
    {
      id: 'badge-soldering-maestro',
      name: 'Soldering Maestro',
      description: 'Complete and mark your first repurposed hardware project as built.',
      iconName: 'Wrench',
      unlocked: completedLogs.length >= 1,
      unlockProgress: completedLogs.length >= 1 ? 100 : 0,
      requirementText: `${completedLogs.length} / 1 project built`,
    },
    {
      id: 'badge-carbon-saver',
      name: 'Zero Waste Pioneer',
      description: 'Prevent at least 1.5 kg of lifecycle CO₂ emissions via e-waste reuse.',
      iconName: 'Leaf',
      unlocked: totalCo2 >= 1.5,
      unlockProgress: Math.min(100, Math.round((totalCo2 / 1.5) * 100)),
      requirementText: `${totalCo2.toFixed(1)}kg / 1.5kg CO₂ offset`,
    },
    {
      id: 'badge-power-cycler',
      name: 'Power Harvester',
      description: 'Inventory a power storage or renewable module (e.g., 9V, 18650, or solar cell).',
      iconName: 'Zap',
      unlocked: inventory.some((i) => i.category === 'Power'),
      unlockProgress: inventory.some((i) => i.category === 'Power') ? 100 : 0,
      requirementText: inventory.some((i) => i.category === 'Power')
        ? 'Power module secured'
        : '0 / 1 Power module',
    },
  ];
}
