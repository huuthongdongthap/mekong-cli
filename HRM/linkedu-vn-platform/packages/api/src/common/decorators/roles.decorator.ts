import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const PERMISSIONS_KEY = 'permissions'

export type Role = string

export const USER_ROLES_KEY = ROLES_KEY
export type PermissionsMetadata = string[]

/**
 * @Roles('school_admin', 'super_admin')
 * Use with RolesGuard to enforce RBAC.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)

/**
 * @Permissions('program:create', 'program:read')
 * Fine-grained permission check (future use).
 */
export const Permissions = (...perms: PermissionsMetadata) =>
  SetMetadata(PERMISSIONS_KEY, perms)

export interface RolesMetadata {
  roles?: Role[]
  permissions?: string[]
}
