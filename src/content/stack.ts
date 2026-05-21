export interface ToolGroup {
  name: string
  tools: string[]
}

export const stack: ToolGroup[] = [
  {
    name: 'AI & Intelligence',
    tools: [
      'Python',
      'PyTorch',
      'XGBoost',
      'scikit-learn',
      'HuggingFace',
      'MLflow',
      'PuLP',
      'Pyomo',
      'OR-Tools',
    ],
  },
  {
    name: 'Data Engineering',
    tools: [
      'Apache Kafka',
      'Apache Spark',
      'Apache Airflow',
      'dbt',
      'PostgreSQL',
      'BigQuery',
      'DuckDB',
      'AWS S3',
      'Parquet',
    ],
  },
  {
    name: 'Backend & APIs',
    tools: ['FastAPI', 'Flask', 'Next.js', 'TypeScript', 'Redis', 'SQLAlchemy', 'JWT', 'OpenAPI'],
  },
  {
    name: 'Cloud & Infrastructure',
    tools: [
      'AWS (S3, EC2, Lambda, SES, DynamoDB)',
      'GCP',
      'Terraform',
      'Docker',
      'Docker Compose',
      'Nginx',
      'GitHub Actions',
    ],
  },
  {
    name: 'Frontend & Visualization',
    tools: [
      'React 18',
      'Tailwind CSS',
      'Framer Motion',
      'Three.js',
      'Streamlit',
      'Plotly',
      'Recharts',
    ],
  },
]
