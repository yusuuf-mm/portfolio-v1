export const narrative = {
  heading: 'The Engineer Behind the Systems',
  paragraphs: [
    "I started as a software engineer. Shipped code, broke things, fixed them. Learned what it actually takes to build something that holds up.",
    "Then I went deeper — machine learning, data science, data engineering. Not because it was trending, but because I wanted to understand how intelligence gets built from the ground up.",
    "Now I work at the intersection of all of it. I build AI systems that don't just run models — they make decisions, optimize outcomes, and adapt. Operations Research is the core. Everything else is the stack.",
  ],
}

export const journey = [
  {
    tag: 'SE',
    role: 'Software Engineering',
    description: 'Where it started',
    isCurrent: false,
  },
  {
    tag: 'ML',
    role: 'Machine Learning & DS',
    description: 'Teaching machines to see patterns',
    isCurrent: false,
  },
  {
    tag: 'DE',
    role: 'Data Engineering',
    description: 'Architecting the pipelines',
    isCurrent: false,
  },
  {
    tag: 'AI',
    role: 'AI Systems + OR',
    description: 'Where I live now',
    isCurrent: true,
  },
]

export const pillars = [
  {
    icon: 'RiBrainLine',
    title: 'Intelligent Systems',
    description:
      "I integrate AI models into production systems — not as demos, but as decision-making engines embedded in real workflows.",
    specifics: [
      'Claude API, Gemini, HuggingFace model integration',
      'Agentic workflows and orchestration',
      'AI-powered automation pipelines',
      'Real-time inference systems',
    ],
    badges: ['Claude API', 'Gemini', 'LangChain', 'Python'],
  },
  {
    icon: 'RiLineChartLine',
    title: 'Optimization & Decision Models',
    description:
      "With a background in operations research, I build mathematical models that don't just predict — they prescribe the best action.",
    specifics: [
      'Linear and integer programming',
      'Descriptive, predictive, prescriptive analytics',
      'Simulation and scenario modeling',
      'Multi-objective optimization',
    ],
    badges: ['OR-Tools', 'PuLP', 'PyTorch', 'SciPy'],
  },
  {
    icon: 'RiStackLine',
    title: 'End-to-End Engineering',
    description:
      "From raw data to deployed model to cloud infrastructure — I can own the full stack without handing off to three different teams.",
    specifics: [
      'Data pipelines and feature engineering',
      'Model training, evaluation, deployment',
      'Cloud infrastructure (AWS)',
      'Full-stack application development',
    ],
    badges: ['AWS', 'Next.js', 'TypeScript', 'dbt'],
  },
]
