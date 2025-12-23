export type BuilderRunTemplate = {
  id: string;
  title: string;
  description: string;
  defaults: {
    kind: "analysis" | "plan" | "patch" | "audit";
    jobType: "coding_lane" | "autobuilder";
    env: string;
    lane: string;
    description: string;
    paths: string[];
    constraints: string[];
  };
};

export type RunPlanStep = {
  id: string;
  title: string;
  description: string;
  action_type: "create_and_tick_once" | "approve_and_tick" | "continue" | "tick_once";
  requires_approval: boolean;
};

export type RunPlanTemplate = {
  id: string;
  title: string;
  description: string;
  steps: RunPlanStep[];
  defaults: {
    kind: "analysis" | "plan" | "patch" | "audit";
    jobType: "coding_lane" | "autobuilder";
    env: string;
    lane: string;
    description: string;
    paths: string[];
    constraints: string[];
  };
};

export const BUILDER_RUN_TEMPLATES: BuilderRunTemplate[] = [
  {
    id: "doc_patch",
    title: "Doc patch (README/docs only)",
    description: "Safest patch template limited to docs.",
    defaults: {
      kind: "patch",
      jobType: "coding_lane",
      env: "dev",
      lane: "innovation",
      description: "Update docs with minimal changes.",
      paths: ["README.md", "docs/"],
      constraints: [
        "Only modify documentation files (README.md, docs/*).",
        "Do not change runtime behavior.",
        "Keep edits minimal and focused.",
      ],
    },
  },
  {
    id: "fix_test",
    title: "Fix failing test (minimal diff)",
    description: "Patch to address one failing test with smallest change.",
    defaults: {
      kind: "patch",
      jobType: "coding_lane",
      env: "dev",
      lane: "innovation",
      description: "Fix a failing test with minimal diff.",
      paths: ["tests/"],
      constraints: [
        "Target only the failing test and minimal required code.",
        "No refactors unless required for fix.",
        "Run relevant tests after changes.",
      ],
    },
  },
  {
    id: "audit_only",
    title: "Audit only (no patch)",
    description: "Run an audit-style objective; no edits expected.",
    defaults: {
      kind: "audit",
      jobType: "coding_lane",
      env: "dev",
      lane: "innovation",
      description: "Audit current behavior and report findings.",
      paths: [],
      constraints: [
        "Do not modify files.",
        "Produce actionable findings and file pointers.",
      ],
    },
  },
];

export const RUN_PLAN_TEMPLATES: RunPlanTemplate[] = [
  {
    id: "code_review_workflow",
    title: "Code Review Workflow",
    description: "Guided code review with approve steps.",
    defaults: {
      kind: "patch",
      jobType: "coding_lane",
      env: "dev",
      lane: "innovation",
      description: "Run a code review with manual approval steps.",
      paths: [],
      constraints: [],
    },
    steps: [
      {
        id: "create_and_initial_tick",
        title: "Create & Initial Analysis",
        description: "Create run and perform initial analysis.",
        action_type: "create_and_tick_once",
        requires_approval: false,
      },
      {
        id: "review_changes",
        title: "Review Changes",
        description: "Review the proposed changes and decide whether to approve.",
        action_type: "approve_and_tick",
        requires_approval: true,
      },
      {
        id: "finalize",
        title: "Finalize",
        description: "Complete the review and apply changes.",
        action_type: "continue",
        requires_approval: false,
      },
    ],
  },
  {
    id: "feature_deployment",
    title: "Feature Deployment",
    description: "Multi-step feature deployment with safety checks.",
    defaults: {
      kind: "patch",
      jobType: "coding_lane",
      env: "dev",
      lane: "innovation",
      description: "Deploy a new feature with incremental steps.",
      paths: [],
      constraints: [],
    },
    steps: [
      {
        id: "create_and_plan",
        title: "Create & Plan",
        description: "Create run and generate deployment plan.",
        action_type: "create_and_tick_once",
        requires_approval: false,
      },
      {
        id: "approve_deployment",
        title: "Approve Deployment",
        description: "Approve the deployment plan before execution.",
        action_type: "approve_and_tick",
        requires_approval: true,
      },
      {
        id: "execute_deployment",
        title: "Execute Deployment",
        description: "Execute the deployment steps.",
        action_type: "continue",
        requires_approval: false,
      },
      {
        id: "verify_deployment",
        title: "Verify Deployment",
        description: "Verify deployment success.",
        action_type: "tick_once",
        requires_approval: false,
      },
    ],
  },
];

export function runRunPlanTemplatesTests() {
  // Ensure all templates have at least one step and valid action types.
  const validActionTypes: RunPlanStep["action_type"][] = [
    "create_and_tick_once",
    "approve_and_tick",
    "continue",
    "tick_once",
  ];

  RUN_PLAN_TEMPLATES.forEach((tpl) => {
    if (!tpl.steps.length) {
      throw new Error(`RunPlan template '${tpl.id}' has no steps`);
    }
    tpl.steps.forEach((step) => {
      if (!validActionTypes.includes(step.action_type)) {
        throw new Error(
          `RunPlan template '${tpl.id}' has invalid action_type '${step.action_type}' in step '${step.id}'`,
        );
      }
    });
  });
}
