import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY, RolesMetadata } from '../decorators/roles.decorator'

// Map each role to the tenant field they're scoped by
const ROLE_TENANT_FIELD: Record<string, string | null> = {
  school_admin: 'schoolId',
  school_staff: 'schoolId',
  enterprise_admin: 'enterpriseId',
  enterprise_hr: 'enterpriseId',
  learner: 'schoolId',
  super_admin: null, // no scoping
}

interface AuthUser {
  id: string
  role: string
  schoolId?: string | undefined
  enterpriseId?: string | undefined
}

/**
 * TenantGuard enforces that a user can only access resources
 * within their own tenant (school or enterprise).
 *
 * @example
 * @UseGuards(JwtAuthGuard, TenantGuard)
 * @Roles('school_admin')
 * @TenantField('schoolId')
 * getMySchool() { ... }
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user: AuthUser = request.user as AuthUser
    const _rolesMetadata = this.reflector.getAllAndOverride<RolesMetadata[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!user) {
      throw new ForbiddenException('Không xác định được người dùng')
    }

    // Super admin bypasses all tenant checks
    if (user.role === 'super_admin') return true

    const tenantField = ROLE_TENANT_FIELD[user.role]
    if (!tenantField) return true

    const resourceTenantId = request.params?.[tenantField] || request.body?.[tenantField] || request.query?.[tenantField]

    if (!resourceTenantId) {
      throw new ForbiddenException(`Thiếu tham số ${tenantField}`)
    }

    const userTenantId = user[tenantField as keyof AuthUser] as string | undefined
    if (!userTenantId) {
      throw new ForbiddenException('Người dùng chưa được gán vào tổ chức')
    }

    if (userTenantId !== resourceTenantId) {
      throw new ForbiddenException('Không có quyền truy cập dữ liệu của tổ chức khác')
    }

    return true
  }
}
