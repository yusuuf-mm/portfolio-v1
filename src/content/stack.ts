import type { IconType } from 'react-icons'
import {
  SiPython,
  SiPytorch,
  SiScikitlearn,
  SiApachekafka,
  SiApachespark,
  SiPostgresql,
  SiFastapi,
  SiFlask,
  SiNextdotjs,
  SiTypescript,
  SiRedis,
  SiTerraform,
  SiDocker,
  SiNginx,
  SiGithubactions,
  SiReact,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiStreamlit,
  SiPlotly,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { SiGooglecloud } from 'react-icons/si'

export interface Tool {
  name: string
  icon: IconType | null
}

export interface ToolGroup {
  name: string
  tools: Tool[]
}

export const stack: ToolGroup[] = [
  {
    name: 'AI & Intelligence',
    tools: [
      { name: 'Python', icon: SiPython },
      { name: 'PyTorch', icon: SiPytorch },
      { name: 'scikit-learn', icon: SiScikitlearn },
      { name: 'HuggingFace', icon: null },
      { name: 'MLflow', icon: null },
      { name: 'XGBoost', icon: null },
      { name: 'PuLP', icon: null },
      { name: 'Pyomo', icon: null },
      { name: 'OR-Tools', icon: null },
    ],
  },
  {
    name: 'Data Engineering',
    tools: [
      { name: 'Apache Kafka', icon: SiApachekafka },
      { name: 'Apache Spark', icon: SiApachespark },
      { name: 'Airflow', icon: null },
      { name: 'dbt', icon: null },
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'BigQuery', icon: null },
      { name: 'DuckDB', icon: null },
      { name: 'AWS S3', icon: null },
      { name: 'Parquet', icon: null },
    ],
  },
  {
    name: 'Backend & APIs',
    tools: [
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'Flask', icon: SiFlask },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Redis', icon: SiRedis },
      { name: 'JWT', icon: null },
      { name: 'OpenAPI', icon: null },
      { name: 'SQLAlchemy', icon: null },
    ],
  },
  {
    name: 'Cloud & Infrastructure',
    tools: [
      { name: 'AWS', icon: FaAws },
      { name: 'GCP', icon: SiGooglecloud },
      { name: 'Terraform', icon: SiTerraform },
      { name: 'Docker', icon: SiDocker },
      { name: 'Nginx', icon: SiNginx },
      { name: 'GitHub Actions', icon: SiGithubactions },
      { name: 'DynamoDB', icon: null },
    ],
  },
  {
    name: 'Frontend & Visualization',
    tools: [
      { name: 'React', icon: SiReact },
      { name: 'Tailwind', icon: SiTailwindcss },
      { name: 'Framer', icon: SiFramer },
      { name: 'Three.js', icon: SiThreedotjs },
      { name: 'Streamlit', icon: SiStreamlit },
      { name: 'Plotly', icon: SiPlotly },
    ],
  },
]
