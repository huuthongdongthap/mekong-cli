import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

export interface RetentionEvent {
  userId: string
  variant: string
  flagKey: string
  timestamp: Date
  properties?: Record<string, unknown>
}

export interface FeatureFlagState {
  flagKey: string
  state: 'number' | 'boolean' | 'json' | 'multivariate'
  defaultValue: unknown
  rules: FlagRule[]
}

export interface FlagRule {
  clause: Clause[]
  variation: unknown
  rollout?: number
}

export interface Clause {
  attribute: string
  op: 'in' | 'notIn' | 'startsWith' | 'endsWith' | 'match' | 'contains' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual' | 'before' | 'after' | 'segmentMatch' | 'semverEqual' | 'semverLessThan' | 'semverGreaterThan'
  values: string[]
  negate: boolean
}

export interface RetentionResult {
  flagKey: string
  retentionRate: number
  pglV1Number: number
  discoRetention: number
  causalImpact: number
  confidence: 'high' | 'medium' | 'low'
}

@Injectable()
export class RetentionService {
  constructor(private prisma: PrismaService) {}

  async trackRetentionEvent(event: RetentionEvent): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO retention_events (user_id, variant, flag_key, timestamp, properties)
      VALUES (${event.userId}, ${event.variant}, ${event.flagKey}, ${event.timestamp}, ${JSON.stringify(event.properties ?? {})})
      ON CONFLICT (user_id, flag_key) DO UPDATE
      SET variant = EXCLUDED.variant, timestamp = EXCLUDED.timestamp
    `
  }

  async computeRetention(flagKey: string): Promise<RetentionResult> {
    const pgl = await this.prisma.$queryRaw<{ retention: number }[]>`
      SELECT COUNT(DISTINCT user_id)::float / NULLIF(COUNT(*), 0) AS retention
      FROM retention_events
      WHERE flag_key = ${flagKey}
    `
    const pglV1Number = pgl[0]?.retention ?? 0

    const disco = await this.prisma.$queryRaw<{ disco: number }[]>`
      SELECT COUNT(DISTINCT user_id)::float / NULLIF(COUNT(*), 0) AS disco
      FROM user_disco_scores
      WHERE flag_key = ${flagKey}
    `
    const discoRetention = disco[0]?.disco ?? 0

    const causalImpact = pglV1Number > 0 ? discoRetention / pglV1Number : 0

    return {
      flagKey,
      retentionRate: pglV1Number,
      pglV1Number,
      discoRetention,
      causalImpact,
      confidence: causalImpact > 0.2 ? 'high' : causalImpact > 0.05 ? 'medium' : 'low',
    }
  }
}
