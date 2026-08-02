export type EstimateFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  timeline: string;
  budget: string;
  addOns: string[];
  goals: string;
};

export type EstimateSummary = {
  baseLabel: string;
  baseCost: number;
  addOnCost: number;
  timelineAdjustment: number;
  total: number;
  advance: number;
  finalPayment: number;
  timelineLabel: string;
  budgetLabel: string;
  addOnLabels: string[];
};

export const projectTypePricing: Record<string, { label: string; cost: number }> = {
  portfolio: { label: "Portfolio website", cost: 18000 },
  business: { label: "Business website", cost: 28000 },
  landing: { label: "Landing page", cost: 15000 },
  ecommerce: { label: "E-commerce experience", cost: 45000 },
  dashboard: { label: "Dashboard or SaaS UI", cost: 52000 },
  custom: { label: "Custom product experience", cost: 65000 }
};

export const addOnPricing: Record<string, { label: string; cost: number }> = {
  branding: { label: "Brand direction", cost: 8000 },
  seo: { label: "SEO setup", cost: 7000 },
  copy: { label: "Conversion copy", cost: 6000 },
  cms: { label: "CMS or admin panel", cost: 12000 },
  motion: { label: "Advanced motion", cost: 9000 },
  support: { label: "Post-launch support", cost: 5000 }
};

export const timelineAdjustments: Record<string, { label: string; factor: number }> = {
  flexible: { label: "Flexible timeline", factor: 1 },
  standard: { label: "2 to 4 weeks", factor: 1.08 },
  rush: { label: "Rush delivery", factor: 1.2 }
};

const budgetLabels: Record<string, string> = {
  under20: "Under INR 20k",
  "20to40": "INR 20k to 40k",
  "40to75": "INR 40k to 75k",
  above75: "INR 75k+"
};

export function calculateEstimate(values: Pick<EstimateFormValues, "projectType" | "timeline" | "budget" | "addOns">): EstimateSummary {
  const base = projectTypePricing[values.projectType] ?? projectTypePricing.business;
  const timeline = timelineAdjustments[values.timeline] ?? timelineAdjustments.standard;
  const addOnEntries = values.addOns.map((key) => addOnPricing[key]).filter(Boolean);
  const addOnCost = addOnEntries.reduce((sum, item) => sum + item.cost, 0);
  const preAdjusted = base.cost + addOnCost;
  const total = Math.round(preAdjusted * timeline.factor);
  const advance = Math.round(total * 0.4);

  return {
    baseLabel: base.label,
    baseCost: base.cost,
    addOnCost,
    timelineAdjustment: total - preAdjusted,
    total,
    advance,
    finalPayment: total - advance,
    timelineLabel: timeline.label,
    budgetLabel: budgetLabels[values.budget] ?? budgetLabels["20to40"],
    addOnLabels: addOnEntries.map((item) => item.label)
  };
}

export const estimateOptions = {
  projectTypes: Object.entries(projectTypePricing).map(([value, item]) => ({ value, label: item.label })),
  timelines: Object.entries(timelineAdjustments).map(([value, item]) => ({ value, label: item.label })),
  budgets: Object.entries(budgetLabels).map(([value, label]) => ({ value, label })),
  addOns: Object.entries(addOnPricing).map(([value, item]) => ({ value, label: item.label }))
};
