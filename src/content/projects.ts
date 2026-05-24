export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  type: string
  status: 'Live' | 'Complete' | 'In Development'
  stack: string[]
  highlights: string[]
  github: string | null
  demo: string | null
  featured: boolean
  gradient: string
  animation?: 'grid' | 'lines' | 'dots'
}

export const projects: Project[] = [
  {
    id: 'neti-hyoptima',
    title: 'NETI–HyOptima',
    subtitle: 'Net-Zero Energy Transition Intelligence',
    description:
      'A cloud-native AI decision intelligence platform that translates energy transition policies into optimized, data-driven strategies for hybrid energy systems.',
    type: 'Research Project',
    status: 'In Development',
    stack: ['Python', 'Pyomo', 'LSTM', 'XGBoost', 'Prophet', 'FastAPI', 'AWS S3', 'Airflow'],
    highlights: [
      'MILP optimization engine (Pyomo) minimizing cost, emissions, and unserved energy',
      'ML forecasting stack: LSTM + XGBoost + Prophet for demand and renewable prediction',
      'NEXUS layer: agentic NLP interface for natural language interaction with optimization models',
    ],
    github: 'https://github.com/yusuuf-mm/neti-hyoptima',
    demo: null,
    featured: true,
    gradient: 'project-gradient-neti',
    animation: 'grid',
  },
  {
    id: 'energy-pipeline',
    title: 'Real-Time Energy Pipeline',
    subtitle: 'End-to-End Cloud-Native Data Engineering',
    description:
      'A portfolio-grade cloud-native pipeline that simulates, streams, processes, stores, transforms, optimizes, and visualizes energy distribution data.',
    type: 'Data Engineering',
    status: 'Complete',
    stack: ['Kafka', 'Apache Spark', 'dbt', 'PuLP', 'Airflow', 'PostgreSQL', 'AWS S3', 'Terraform'],
    highlights: [
      'Real-time IoT simulation → Kafka → Spark → PostgreSQL + S3 pipeline',
      'Stage 1 LP optimizer: fair energy allocation across 5 zones by priority',
      '~3% total transmission loss achieved through shortest-path routing',
    ],
    github: 'https://github.com/yusuuf-mm/realtime-energy-optimization-pipeline',
    demo: null,
    featured: true,
    gradient: 'project-gradient-energy',
    animation: 'lines',
  },
  {
    id: 'habitos',
    title: 'HabitOS',
    subtitle: 'AI-Driven Behavioral Optimization Platform',
    description:
      'A production-grade full-stack decision support system that transforms life goals into mathematically optimized daily schedules using MILP.',
    type: 'Full-Stack AI',
    status: 'Live',
    stack: ['FastAPI', 'React 18', 'TypeScript', 'PuLP', 'PostgreSQL', 'Redis', 'Docker'],
    highlights: [
      'MILP solver (PuLP + CBC) optimizing daily schedule across time, energy, and constraints',
      'Solves typical schedules in under 500ms — near real-time performance',
      'Full CI/CD pipeline with GitHub Actions, deployed live on Render',
    ],
    github: 'https://github.com/yusuuf-mm/HabitOS',
    demo: 'https://habitos-bnnl.onrender.com',
    featured: true,
    gradient: 'project-gradient-habitos',
    animation: 'dots',
  },
  {
    id: 'titanic-optimizer',
    title: 'Titanic Optimizer',
    subtitle: 'ML Prediction + Operations Research Allocation',
    description:
      'A full-stack decision intelligence system fusing XGBoost survival prediction with Mixed-Integer Programming for lifeboat allocation.',
    type: 'ML + Operations Research',
    status: 'Complete',
    stack: ['XGBoost', 'PuLP', 'FastAPI', 'Streamlit', 'MLflow', 'AWS S3'],
    highlights: [
      'XGBoost classifier achieving 85% accuracy and 0.82 F1 score',
      'MIP optimizer with ethical constraints: ≥30% children, ≥50% women priority',
    ],
    github: 'https://github.com/yusuuf-mm/Titanic-Survival-Prediction-Optimization-Engine',
    demo: null,
    featured: false,
    gradient: 'project-gradient-titanic',
  },
  {
    id: 'expensewise',
    title: 'ExpenseWise',
    subtitle: 'AI-Powered Expense Analysis Platform',
    description:
      'An AI-integrated expense analysis service using OpenAI and Google Gemini for personalized financial forecasting.',
    type: 'AI Integration',
    status: 'Complete',
    stack: ['Flask', 'OpenAI', 'Gemini API', 'PostgreSQL', 'Python'],
    highlights: [
      'OpenAI + Gemini integration for personalized financial insights',
      '~30% improvement in backend API efficiency',
    ],
    github: null,
    demo: null,
    featured: false,
    gradient: 'project-gradient-expensewise',
  },
]
