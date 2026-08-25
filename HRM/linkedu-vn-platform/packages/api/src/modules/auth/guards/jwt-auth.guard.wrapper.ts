import { AuthGuard } from '@nestjs/passport'

/** Re-export for convenience */
export const JwtAuthGuard = AuthGuard('jwt')
