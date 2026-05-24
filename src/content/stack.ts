import type { IconType } from 'react-icons'
import {
  SiPython,
  SiPytorch,
  SiScikitlearn,
  SiHuggingface,
  SiMlflow,
  SiApachekafka,
  SiApachespark,
  SiApacheairflow,
  SiDbt,
  SiPostgresql,
  SiGooglebigquery,
  SiDuckdb,
  SiAmazons3,
  SiFastapi,
  SiFlask,
  SiNextdotjs,
  SiTypescript,
  SiRedis,
  SiJsonwebtokens,
  SiOpenapiinitiative,
  SiAmazonwebservices,
  SiGooglecloud,
  SiTerraform,
  SiDocker,
  SiNginx,
  SiGithubactions,
  SiAmazondynamodb,
  SiReact,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
  SiStreamlit,
  SiPlotly,
} from 'react-icons/si'

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
      { name: 'HuggingFace', icon: SiHuggingface },
      { name: 'MLflow', icon: SiMlflow },
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
      { name: 'Apache Airflow', icon: SiApacheairflow },
      { name: 'dbt', icon: SiDbt },
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'BigQuery', icon: SiGooglebigquery },
      { name: 'DuckDB', icon: SiDuckdb },
      { name: 'AWS S3', icon: SiAmazons3 },
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
      { name: 'JWT', icon: SiJsonwebtokens },
      { name: 'OpenAPI', icon: SiOpenapiinitiative },
      { name: 'SQLAlchemy', icon: null },
    ],
  },
  {
    name: 'Cloud & Infrastructure',
    tools: [
      { name: 'AWS', icon: SiAmazonwebservices },
      { name: 'GCP', icon: SiGooglecloud },
      { name: 'Terraform', icon: SiTerraform },
      { name: 'Docker', icon: SiDocker },
      { name: 'Nginx', icon: SiNginx },
      { name: 'GitHub Actions', icon: SiGithubactions },
      { name: 'DynamoDB', icon: SiAmazondynamodb },
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
