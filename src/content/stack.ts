// Types
export type UsageIntensity = 'none' | 'low' | 'medium' | 'high'

export interface ToolUsage {
  projectId: string
  intensity: UsageIntensity
  subsystem?: string
  role?: string
}

export interface Tool {
  name: string
  usage: ToolUsage[]
}

export interface ToolCategory {
  id: string
  name: string
  shortName: string
  color: string
  tools: Tool[]
}

// Project IDs for reference
export const PROJECT_IDS = {
  ENERGY_PIPELINE: 'energy-pipeline',
  HABITOS: 'habitos',
  NETI: 'neti-hyoptima',
  TITANIC: 'titanic-optimizer',
  EXPENSEWISE: 'expensewise',
} as const

export const PROJECT_LABELS: Record<string, string> = {
  'energy-pipeline': 'Energy Pipeline',
  habitos: 'HabitOS',
  'neti-hyoptima': 'NETI',
  'titanic-optimizer': 'Titanic',
  expensewise: 'ExpenseWise',
}

export const PROJECT_ORDER = [
  'energy-pipeline',
  'habitos',
  'neti-hyoptima',
  'titanic-optimizer',
  'expensewise',
]

// Intensity color map for the heatmap
export const INTENSITY_COLORS: Record<UsageIntensity, string> = {
  none: 'transparent',
  low: 'rgba(184, 147, 90, 0.25)',
  medium: 'rgba(184, 147, 90, 0.55)',
  high: 'rgba(184, 147, 90, 0.9)',
}

// Category color palette (muted for dark theme)
export const CATEGORY_COLORS = {
  ai: '#4A6FA5',
  data: '#6B8E6B',
  backend: '#8B7B8B',
  cloud: '#7A8B8B',
  frontend: '#B8935A',
}

// Enhanced stack data with tool-project mappings
export const stack: ToolCategory[] = [
  {
    id: 'ai-intelligence',
    name: 'AI & Intelligence',
    shortName: 'AI',
    color: CATEGORY_COLORS.ai,
    tools: [
      {
        name: 'Python',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'ETL & Optimization', role: 'Core orchestration and LP solvers' },
          { projectId: 'habitos', intensity: 'low', subsystem: 'Backend Logic', role: 'MILP solver integration' },
          { projectId: 'neti-hyoptima', intensity: 'high', subsystem: 'ML Pipeline', role: 'Forecasting and optimization engine' },
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'ML + MIP', role: 'XGBoost training and MIP allocation' },
          { projectId: 'expensewise', intensity: 'high', subsystem: 'AI Backend', role: 'LLM integration layer' },
        ],
      },
      {
        name: 'PyTorch',
        usage: [
          { projectId: 'neti-hyoptima', intensity: 'medium', subsystem: 'Forecasting', role: 'LSTM model training' },
        ],
      },
      {
        name: 'XGBoost',
        usage: [
          { projectId: 'neti-hyoptima', intensity: 'high', subsystem: 'Demand Forecasting', role: 'Gradient boosted regression' },
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'Survival Prediction', role: '85% accuracy classifier' },
        ],
      },
      {
        name: 'scikit-learn',
        usage: [
          { projectId: 'neti-hyoptima', intensity: 'medium', subsystem: 'Feature Engineering', role: 'Preprocessing pipelines' },
          { projectId: 'titanic-optimizer', intensity: 'medium', subsystem: 'ML Pipeline', role: 'Feature preprocessing' },
        ],
      },
      {
        name: 'HuggingFace',
        usage: [
          { projectId: 'neti-hyoptima', intensity: 'low', subsystem: 'NLP Agent', role: 'Embedding models for RAG' },
        ],
      },
      {
        name: 'MLflow',
        usage: [
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'Experiment Tracking', role: 'Model versioning and metrics' },
          { projectId: 'neti-hyoptima', intensity: 'medium', subsystem: 'Model Registry', role: 'Forecast model tracking' },
        ],
      },
      {
        name: 'PuLP',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Stage 1 Optimizer', role: 'LP fair allocation solver' },
          { projectId: 'habitos', intensity: 'high', subsystem: 'Schedule Optimizer', role: 'MILP daily schedule solver' },
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'Lifeboat Allocation', role: 'MIP with ethical constraints' },
        ],
      },
      {
        name: 'Pyomo',
        usage: [
          { projectId: 'neti-hyoptima', intensity: 'high', subsystem: 'MILP Engine', role: 'Multi-objective energy optimization' },
        ],
      },
      {
        name: 'OR-Tools',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'medium', subsystem: 'Stage 2 Optimizer', role: 'Transportation routing' },
        ],
      },
    ],
  },
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    shortName: 'Data',
    color: CATEGORY_COLORS.data,
    tools: [
      {
        name: 'Apache Kafka',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Streaming Layer', role: 'Real-time IoT data ingestion' },
        ],
      },
      {
        name: 'Apache Spark',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Stream Processing', role: 'Spark Structured Streaming' },
        ],
      },
      {
        name: 'Apache Airflow',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Orchestration', role: 'DAG scheduling every 10 min' },
          { projectId: 'neti-hyoptima', intensity: 'medium', subsystem: 'ETL Pipeline', role: 'AWS Glue orchestration' },
        ],
      },
      {
        name: 'dbt',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Transform Layer', role: 'SQL-based transformations' },
        ],
      },
      {
        name: 'PostgreSQL',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Data Warehouse', role: 'Analytical storage layer' },
          { projectId: 'habitos', intensity: 'high', subsystem: 'Primary Database', role: 'User and schedule storage' },
          { projectId: 'expensewise', intensity: 'high', subsystem: 'Primary Database', role: 'Financial data storage' },
        ],
      },
      {
        name: 'BigQuery',
        usage: [
          { projectId: 'neti-hyoptima', intensity: 'low', subsystem: 'Analytics', role: 'Historical data queries' },
        ],
      },
      {
        name: 'DuckDB',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'low', subsystem: 'Local Analytics', role: 'Development queries' },
        ],
      },
      {
        name: 'AWS S3',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Data Lake', role: 'Parquet file storage' },
          { projectId: 'neti-hyoptima', intensity: 'high', subsystem: 'Model Registry', role: 'ML artifact storage' },
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'Model Storage', role: 'MLflow artifact backend' },
        ],
      },
      {
        name: 'Parquet',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'File Format', role: 'Columnar data storage' },
        ],
      },
    ],
  },
  {
    id: 'backend-apis',
    name: 'Backend & APIs',
    shortName: 'Backend',
    color: CATEGORY_COLORS.backend,
    tools: [
      {
        name: 'FastAPI',
        usage: [
          { projectId: 'habitos', intensity: 'high', subsystem: 'API Layer', role: 'Async REST endpoints' },
          { projectId: 'neti-hyoptima', intensity: 'high', subsystem: 'Optimization API', role: 'Model serving endpoints' },
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'Prediction API', role: 'ML model serving' },
        ],
      },
      {
        name: 'Flask',
        usage: [
          { projectId: 'expensewise', intensity: 'high', subsystem: 'API Layer', role: 'REST API framework' },
        ],
      },
      {
        name: 'Next.js',
        usage: [
          { projectId: 'habitos', intensity: 'low', subsystem: 'Frontend', role: 'SSR consideration' },
        ],
      },
      {
        name: 'TypeScript',
        usage: [
          { projectId: 'habitos', intensity: 'high', subsystem: 'Frontend', role: 'Type-safe React components' },
        ],
      },
      {
        name: 'Redis',
        usage: [
          { projectId: 'habitos', intensity: 'medium', subsystem: 'Caching', role: 'Session and cache layer' },
        ],
      },
      {
        name: 'SQLAlchemy',
        usage: [
          { projectId: 'habitos', intensity: 'medium', subsystem: 'ORM', role: 'Database abstraction' },
          { projectId: 'expensewise', intensity: 'medium', subsystem: 'ORM', role: 'Database abstraction' },
        ],
      },
      {
        name: 'JWT',
        usage: [
          { projectId: 'habitos', intensity: 'high', subsystem: 'Auth', role: 'Token-based authentication' },
        ],
      },
      {
        name: 'OpenAPI',
        usage: [
          { projectId: 'habitos', intensity: 'high', subsystem: 'API Contract', role: 'Contract-first design' },
          { projectId: 'titanic-optimizer', intensity: 'medium', subsystem: 'Documentation', role: 'Auto-generated docs' },
        ],
      },
    ],
  },
  {
    id: 'cloud-infra',
    name: 'Cloud & Infrastructure',
    shortName: 'Cloud',
    color: CATEGORY_COLORS.cloud,
    tools: [
      {
        name: 'AWS',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Cloud Platform', role: 'S3, EC2, Lambda' },
          { projectId: 'neti-hyoptima', intensity: 'high', subsystem: 'Cloud Platform', role: 'S3, Glue, SageMaker' },
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'Cloud Platform', role: 'S3, DynamoDB' },
        ],
      },
      {
        name: 'GCP',
        usage: [
          { projectId: 'neti-hyoptima', intensity: 'low', subsystem: 'Analytics', role: 'BigQuery integration' },
        ],
      },
      {
        name: 'Terraform',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'IaC', role: 'Infrastructure provisioning' },
        ],
      },
      {
        name: 'Docker',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Containerization', role: 'Service containers' },
          { projectId: 'habitos', intensity: 'high', subsystem: 'Containerization', role: 'App deployment' },
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'Containerization', role: 'ML service container' },
        ],
      },
      {
        name: 'Docker Compose',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Orchestration', role: 'Multi-container setup' },
          { projectId: 'habitos', intensity: 'medium', subsystem: 'Local Dev', role: 'Development environment' },
        ],
      },
      {
        name: 'Nginx',
        usage: [
          { projectId: 'habitos', intensity: 'medium', subsystem: 'Reverse Proxy', role: 'Load balancing and SSL' },
        ],
      },
      {
        name: 'GitHub Actions',
        usage: [
          { projectId: 'habitos', intensity: 'high', subsystem: 'CI/CD', role: 'Automated testing and deploy' },
          { projectId: 'energy-pipeline', intensity: 'medium', subsystem: 'CI/CD', role: 'Pipeline validation' },
        ],
      },
      {
        name: 'DynamoDB',
        usage: [
          { projectId: 'titanic-optimizer', intensity: 'medium', subsystem: 'NoSQL Storage', role: 'Rate limiting and logs' },
        ],
      },
    ],
  },
  {
    id: 'frontend-viz',
    name: 'Frontend & Visualization',
    shortName: 'Frontend',
    color: CATEGORY_COLORS.frontend,
    tools: [
      {
        name: 'React 18',
        usage: [
          { projectId: 'habitos', intensity: 'high', subsystem: 'UI Framework', role: 'Component-based frontend' },
        ],
      },
      {
        name: 'Tailwind CSS',
        usage: [
          { projectId: 'habitos', intensity: 'high', subsystem: 'Styling', role: 'Utility-first CSS' },
        ],
      },
      {
        name: 'Framer Motion',
        usage: [
          { projectId: 'habitos', intensity: 'medium', subsystem: 'Animations', role: 'UI transitions' },
        ],
      },
      {
        name: 'Three.js',
        usage: [],
      },
      {
        name: 'Streamlit',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Dashboard', role: 'Real-time monitoring UI' },
          { projectId: 'titanic-optimizer', intensity: 'high', subsystem: 'Demo UI', role: 'Interactive predictions' },
        ],
      },
      {
        name: 'Plotly',
        usage: [
          { projectId: 'energy-pipeline', intensity: 'high', subsystem: 'Visualization', role: 'Interactive charts' },
          { projectId: 'neti-hyoptima', intensity: 'medium', subsystem: 'Visualization', role: 'Forecast plots' },
        ],
      },
      {
        name: 'Recharts',
        usage: [
          { projectId: 'habitos', intensity: 'medium', subsystem: 'Charts', role: 'Schedule visualizations' },
        ],
      },
    ],
  },
]

// Utility functions
export function getAllTools(): Tool[] {
  return stack.flatMap((category) => category.tools)
}

export function getToolByName(name: string): Tool | undefined {
  return getAllTools().find((tool) => tool.name === name)
}

export function getToolUsageForProject(tool: Tool, projectId: string): ToolUsage | undefined {
  return tool.usage.find((u) => u.projectId === projectId)
}

export function getToolIntensityForProject(tool: Tool, projectId: string): UsageIntensity {
  return getToolUsageForProject(tool, projectId)?.intensity ?? 'none'
}

export function getProjectsUsingTool(tool: Tool): string[] {
  return tool.usage.filter((u) => u.intensity !== 'none').map((u) => u.projectId)
}

export function getToolsUsedInProject(projectId: string): Tool[] {
  return getAllTools().filter((tool) => tool.usage.some((u) => u.projectId === projectId && u.intensity !== 'none'))
}
