import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

function createRatelimit() {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
  })
}

let _ratelimit: Ratelimit | null = null

export function getRatelimit(): Ratelimit {
  if (!_ratelimit) {
    _ratelimit = createRatelimit()
  }
  return _ratelimit
}
