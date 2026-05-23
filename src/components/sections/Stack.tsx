'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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
  SiFastapi,
  SiFlask,
  SiNextdotjs,
  SiTypescript,
  SiRedis,
  SiJsonwebtokens,
  SiOpenapiinitiative,
  SiGooglecloud,
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
  SiSqlalchemy,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'
import { RiRobot2Line, RiLineChartLine } from 'react-icons/ri'
import { cn } from '@/lib/utils'
import { stack } from '@/content/stack'

function ToolBadge({ name }: { name: string }) {
  return (
    <div
      className="inline-flex items-center justify-center px-3 py-1.5 font-mono text-xs text-[var(--text-muted)] border border-[var(--border)] rounded"
      style={{ background: 'var(--surface)' }}
    >
      {name}
    </div>
  )
}

const iconMap: Record<string, IconType> = {
  Python: SiPython,
  PyTorch: SiPytorch,
  XGBoost: RiRobot2Line,
  'scikit-learn': SiScikitlearn,
  HuggingFace: SiHuggingface,
  MLflow: SiMlflow,
  PuLP: RiLineChartLine,
  Pyomo: RiLineChartLine,
  'OR-Tools': RiRobot2Line,
  'Apache Kafka': SiApachekafka,
  'Apache Spark': SiApachespark,
  'Apache Airflow': SiApacheairflow,
  dbt: SiDbt,
  PostgreSQL: SiPostgresql,
  BigQuery: SiGooglebigquery,
  DuckDB: SiDuckdb,
  'AWS S3': FaAws,
  Parquet: RiLineChartLine,
  FastAPI: SiFastapi,
  Flask: SiFlask,
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  Redis: SiRedis,
  SQLAlchemy: SiSqlalchemy,
  JWT: SiJsonwebtokens,
  OpenAPI: SiOpenapiinitiative,
  'AWS (S3, EC2, Lambda, DynamoDB)': FaAws,
  GCP: SiGooglecloud,
  Terraform: SiTerraform,
  Docker: SiDocker,
  'Docker Compose': SiDocker,
  Nginx: SiNginx,
  'GitHub Actions': SiGithubactions,
  'React 18': SiReact,
  'Tailwind CSS': SiTailwindcss,
  'Framer Motion': SiFramer,
  'Three.js': SiThreedotjs,
  Streamlit: SiStreamlit,
  Plotly: SiPlotly,
  Recharts: RiLineChartLine,
}

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="stack" ref={sectionRef} className={cn('py-24 lg:py-32 bg-[var(--background)]')}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
        >
          <div className="flex items-center gap-2 font-mono text-sm text-[var(--accent)]">
            <span>{'>'}</span>
            <span>yusuf.sys ~ stack</span>
          </div>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight">
            Tools I Build With
          </h2>
        </motion.div>

        {/* Groups */}
        <div className="flex flex-col gap-12">
          {stack.map((group, gi) => (
            <div key={group.name}>
              <h3 className="font-mono text-xs font-semibold text-[var(--accent)] tracking-wider uppercase mb-4">
                {group.name}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-3">
                {group.tools.map((tool, ti) => {
                  const Icon = iconMap[tool]
                  return (
                    <motion.div
                      key={tool}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                        delay: gi * 0.08 + ti * 0.03,
                      }}
                    >
                      {Icon ? <ToolIconCard name={tool} Icon={Icon} /> : <ToolBadge name={tool} />}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolIconCard({ name, Icon }: { name: string; Icon: IconType }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-[var(--border)] cursor-default group"
      style={{ background: 'var(--surface)', aspectRatio: '1' }}
      whileHover={{
        borderColor: 'var(--accent)',
        boxShadow: '0 0 20px color-mix(in srgb, var(--accent) 15%, transparent)',
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        style={{ color: 'var(--text-muted)' }}
        whileHover={{ scale: 1.15, color: 'var(--accent)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Icon size={24} />
      </motion.div>
      <span className="font-mono text-[10px] text-[var(--text-muted)] text-center leading-tight truncate w-full">
        {name}
      </span>
    </motion.div>
  )
}
