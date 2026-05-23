export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  type: string
  status: string
  tags: string[]
  stack: string[]
  highlights: string[]
  github: string | null
  demo: string | null
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'neti-hyoptima',
    title: 'NETI\u2013HyOptima',
    subtitle: 'Net-Zero Energy Transition Intelligence',
    description:
      'A cloud-native decision intelligence platform that turns energy transition policies into optimized strategies for hybrid energy systems: gas, renewables, storage, and hydrogen.',
    type: 'Research Project',
    status: 'In Development',
    tags: ['AI Systems', 'Optimization', 'Energy', 'Research'],
    stack: [
      'Python',
      'Pyomo',
      'LSTM',
      'XGBoost',
      'Prophet',
      'FastAPI',
      'AWS S3',
      'Airflow',
      'Monte Carlo',
    ],
    highlights: [
      'MILP optimization engine (Pyomo) minimizing cost, emissions, and unserved energy',
      'ML forecasting: LSTM + XGBoost + Prophet for demand and renewable prediction',
      'Monte Carlo simulation for uncertainty in demand, fuel prices, weather',
      'Agentic NLP interface for natural language interaction with optimization models',
      'ETL pipelines via Airflow + AWS Glue for energy data ingestion',
    ],
    github: 'https://github.com/yusuuf-mm/neti-hyoptima',
    demo: null,
    featured: true,
  },
  {
    id: 'energy-pipeline',
    title: 'Real-Time Energy Data Pipeline',
    subtitle: 'Cloud-Native Data Engineering',
    description:
      'A cloud-native pipeline that handles the full lifecycle of energy distribution data: simulation, streaming, processing, storage, transformation, and optimization.',
    type: 'Data Engineering',
    status: 'Complete',
    tags: ['Data Engineering', 'Optimization', 'Streaming', 'Cloud'],
    stack: [
      'Kafka',
      'Apache Spark',
      'dbt',
      'PuLP',
      'Airflow',
      'PostgreSQL',
      'AWS S3',
      'Terraform',
      'Streamlit',
      'Docker',
    ],
    highlights: [
      'Real-time IoT simulation \u2192 Kafka \u2192 Spark \u2192 PostgreSQL + S3 pipeline',
      'Stage 1 LP optimizer: fair energy allocation across 5 zones by priority',
      'Stage 2 Transportation optimizer: routes power minimizing transmission loss',
      '~3% total transmission loss through shortest-path routing',
      'Airflow DAG orchestrating dbt transforms + optimizer every 10 minutes',
    ],
    github: 'https://github.com/yusuuf-mm/realtime-energy-optimization-pipeline',
    demo: null,
    featured: true,
  },
  {
    id: 'habitos',
    title: 'HabitOS',
    subtitle: 'Behavioral Optimization Platform',
    description:
      'A full-stack system that turns life goals into mathematically optimized daily schedules using Mixed-Integer Linear Programming.',
    type: 'Full-Stack AI',
    status: 'Live',
    tags: ['Full-Stack', 'MILP', 'FastAPI', 'React'],
    stack: [
      'FastAPI',
      'React 18',
      'TypeScript',
      'PuLP',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Nginx',
      'Render',
    ],
    highlights: [
      'MILP solver (PuLP + CBC) optimizing daily schedule across time, energy, and behavioral constraints',
      'Solves typical schedules in under 500ms',
      'JWT authentication, role-based access, async FastAPI backend',
      'OpenAPI contract-first design keeping frontend TypeScript types in sync',
      'CI/CD pipeline with GitHub Actions, deployed on Render',
    ],
    github: 'https://github.com/yusuuf-mm/HabitOS',
    demo: 'https://habitos-bnnl.onrender.com',
    featured: true,
  },
  {
    id: 'titanic-optimizer',
    title: 'Titanic Survival & Lifeboat Optimizer',
    subtitle: 'ML Prediction + Operations Research Allocation',
    description:
      'A decision intelligence system fusing XGBoost survival prediction with Mixed-Integer Programming to solve lifeboat allocation under ethical and capacity constraints.',
    type: 'ML + Operations Research',
    status: 'Complete',
    tags: ['Machine Learning', 'MIP', 'FastAPI', 'AWS'],
    stack: ['XGBoost', 'PuLP', 'FastAPI', 'Streamlit', 'MLflow', 'AWS S3', 'DynamoDB', 'Docker'],
    highlights: [
      'XGBoost classifier achieving 85% accuracy and 0.82 F1 score',
      'MIP optimizer allocating lifeboat seats by survival probability + ethical constraints',
      'Ethical constraints: \u226530% children, \u226550% women priority guarantees',
      'MLflow experiment tracking + AWS S3 model registry',
      'DynamoDB-backed rate limiting and prediction logging',
    ],
    github: 'https://github.com/yusuuf-mm/Titanic-Survival-Prediction-Optimization-Engine',
    demo: null,
    featured: false,
  },
  {
    id: 'expensewise',
    title: 'ExpenseWise',
    subtitle: 'AI-Powered Expense Analysis',
    description:
      'An expense analysis service using OpenAI and Google Gemini for financial forecasting and budgeting recommendations.',
    type: 'AI Integration',
    status: 'Complete',
    tags: ['AI Integration', 'Flask', 'FinTech'],
    stack: ['Flask', 'OpenAI', 'Gemini API', 'PostgreSQL', 'Python'],
    highlights: [
      'OpenAI + Google Gemini integration for personalized financial insights',
      '~30% improvement in backend API efficiency',
      'Automated data processing pipeline for financial reporting',
      'Secure REST API design with frontend integration',
    ],
    github: null,
    demo: null,
    featured: false,
  },
]
