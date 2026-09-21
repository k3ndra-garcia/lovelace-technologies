// Single source of truth for site copy and structure.
// Adding a service, insight, or case study should only require editing this file.

import type { Ink } from "@/lib/css";

export const site = {
  name: "Lovelace Technologies",
  shortName: "Lovelace",
  tagline: "Technology consulting for what comes next.",
  description:
    "Lovelace Technologies helps organizations evaluate, implement, and scale modern technology, from assessment to implementation.",
  calendlyUrl: "https://calendly.com/lovelacetechnologies",
  email: "lovelacetechnologiesgt@gmail.com",
  // Flip to true once the first case studies are published.
  showWorkInNav: false,
};

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
] as const;

export type Service = {
  slug: string;
  /** The practice's colour in the ink family. */
  color: Ink;
  title: string;
  summary: string;
  lead: string;
  outcomes: string[];
  includes: { title: string; body: string }[];
  signals: string[];
};

export const services: Service[] = [
  {
    slug: "ai-enablement",
    color: "blue",
    title: "AI Enablement",
    summary:
      "Find where AI is genuinely useful in your business, put it to work safely, and help your people use it well.",
    lead: "AI is only valuable when it changes how work gets done. We identify the use cases worth pursuing, build and launch them with your team, and set up the training and guardrails that make adoption stick.",
    outcomes: [
      "A ranked list of AI opportunities with clear business cases",
      "Working pilots in production, not slideware",
      "Teams trained to use and improve the tools themselves",
    ],
    includes: [
      {
        title: "Opportunity assessment",
        body: "Workshops and process reviews to find where AI saves time, reduces error, or opens new capability.",
      },
      {
        title: "Data readiness",
        body: "An honest look at whether your data can support the use cases you care about, and what it takes to get there.",
      },
      {
        title: "Pilot design and launch",
        body: "Scoped pilots with success measures agreed up front, built on tools that fit your existing stack.",
      },
      {
        title: "Adoption and training",
        body: "Role-specific training, playbooks, and internal champions so usage grows after launch.",
      },
    ],
    signals: [
      "Leadership wants an AI plan but teams are experimenting on their own",
      "You have pilots that never made it to production",
      "You're unsure what data or policies need to be in place first",
    ],
  },
  {
    slug: "software-implementation",
    color: "teal",
    title: "Software & Implementation",
    summary:
      "Choose the right platforms, then configure, integrate, and launch them alongside your team.",
    lead: "Most software problems start with the wrong selection or a rushed rollout. We run structured selections, manage implementation end to end, and stay through launch so the system actually gets used.",
    outcomes: [
      "Platform decisions grounded in requirements, not demos",
      "Implementations delivered on a plan your team can follow",
      "Clean integrations and migrated data from day one",
    ],
    includes: [
      {
        title: "Requirements and selection",
        body: "Requirements gathering, vendor shortlists, scripted demos, and scoring your stakeholders can stand behind.",
      },
      {
        title: "Implementation management",
        body: "Project leadership across your team and the vendor, with clear owners, milestones, and risks.",
      },
      {
        title: "Integration and migration",
        body: "Connecting systems and moving data with validation, so nothing is lost and reports still reconcile.",
      },
      {
        title: "Launch and hypercare",
        body: "Testing, cutover planning, and hands-on support in the weeks after go-live.",
      },
    ],
    signals: [
      "You're replacing a core system such as ERP, CRM, or HRIS",
      "A current implementation is behind schedule or over budget",
      "Your tools don't talk to each other",
    ],
  },
  {
    slug: "technology-audits",
    color: "brass",
    title: "Technology Audits",
    summary:
      "An independent, clear-eyed view of your systems, spend, and risks, with findings ranked by what to fix first.",
    lead: "Before you invest, you need to know what you have. We inventory your environment, review how it's used and what it costs, and surface the risks and redundancies that are easy to miss from the inside.",
    outcomes: [
      "A complete picture of your applications, infrastructure, and vendors",
      "Identified savings from unused licenses and overlapping tools",
      "A prioritized list of risks with recommended remediation",
    ],
    includes: [
      {
        title: "Systems inventory",
        body: "Applications, infrastructure, integrations, and owners, documented in one place.",
      },
      {
        title: "Spend and license review",
        body: "Where money goes, which licenses go unused, and which contracts are up for renegotiation.",
      },
      {
        title: "Security and resilience review",
        body: "Access controls, backups, vendor exposure, and single points of failure.",
      },
      {
        title: "Findings and roadmap",
        body: "A readable report for leadership, with each finding sized by impact and effort.",
      },
    ],
    signals: [
      "You've grown through acquisition or rapid hiring",
      "Technology spend is rising without a clear reason",
      "A new leader needs an objective baseline",
    ],
  },
  {
    slug: "governance-compliance",
    color: "oxblood",
    title: "Governance & Compliance",
    summary:
      "Policies, controls, and oversight that let you adopt new technology with confidence.",
    lead: "Good governance speeds adoption up rather than slowing it down. We design practical policies and controls sized to your organization, and prepare you for the frameworks your customers and regulators expect.",
    outcomes: [
      "Clear, usable policies for AI, data, and technology use",
      "Controls mapped to the frameworks that apply to you",
      "Leadership reporting that shows where risk stands",
    ],
    includes: [
      {
        title: "AI governance",
        body: "Acceptable-use policies, model and vendor review processes, and oversight roles for AI adoption.",
      },
      {
        title: "Data privacy and protection",
        body: "Data classification, retention, and handling practices that match how your business really works.",
      },
      {
        title: "Framework readiness",
        body: "Gap assessments and remediation plans for frameworks such as SOC 2, HIPAA, and the NIST AI RMF.",
      },
      {
        title: "Vendor risk management",
        body: "A repeatable way to evaluate and monitor the third parties that touch your data.",
      },
    ],
    signals: [
      "Customers are sending security questionnaires you struggle to answer",
      "Employees are using AI tools without guidance",
      "An audit or certification is on the horizon",
    ],
  },
  {
    slug: "technology-strategy",
    color: "plum",
    title: "Technology Strategy",
    summary:
      "A roadmap that ties technology decisions to business goals, budgets, and timelines.",
    lead: "Strategy should make the next decision easier. We connect your business priorities to a sequenced technology roadmap, with the budget, team structure, and trade-offs spelled out.",
    outcomes: [
      "A multi-year roadmap sequenced by value and dependency",
      "Build, buy, or partner decisions with rationale",
      "A budget and operating model leadership can approve",
    ],
    includes: [
      {
        title: "Current and future state",
        body: "Where your technology stands today and what it needs to support where the business is going.",
      },
      {
        title: "Roadmap and sequencing",
        body: "Initiatives ordered by value, effort, and dependency, with realistic timelines.",
      },
      {
        title: "Budget and business case",
        body: "Investment plans and expected returns in terms finance and the board recognize.",
      },
      {
        title: "Operating model",
        body: "The team structure, skills, and partners needed to deliver and run the plan.",
      },
    ],
    signals: [
      "Technology investments feel reactive rather than planned",
      "You're preparing for growth, a new market, or a transaction",
      "Leadership disagrees on where to invest next",
    ],
  },
];

export const approach = [
  {
    step: "Assess",
    color: "blue",
    title: "Understand where you stand",
    body: "We map your systems, data, spend, and teams, and talk to the people who use the tools every day, not only the people who bought them.",
    deliverable: "Current-state assessment",
  },
  {
    step: "Prioritize",
    color: "plum",
    title: "Decide what matters most",
    body: "We rank opportunities and risks by value, effort, and urgency, then turn them into a sequenced roadmap with a budget attached.",
    deliverable: "Prioritized roadmap",
  },
  {
    step: "Implement",
    color: "teal",
    title: "Put the plan to work",
    body: "We select vendors, configure systems, integrate data, and manage the launch. We stay accountable for delivery, not just the plan.",
    deliverable: "Systems in production",
  },
  {
    step: "Enable",
    color: "brass",
    title: "Make it last",
    body: "We train your teams, document how things work, and set up the governance that keeps improving things after we step back.",
    deliverable: "Teams that own it",
  },
] as const;

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  services: string[];
  title: string;
  summary: string;
};

// Empty until case studies are cleared with clients. The homepage and /work
// page render a considered empty state until entries are added.
export const caseStudies: CaseStudy[] = [];

export type Insight = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  topic: string;
};

export const insights: Insight[] = [];
