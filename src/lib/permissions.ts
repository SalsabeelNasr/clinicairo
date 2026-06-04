/**
 * Permission Management Utilities
 *
 * These functions check if the current mock user has access to specific actions.
 * Launch viewing remains permissive; settings and payment verification are the
 * first real restrictions.
 */

export interface UserWithRole {
  role: string
  permissions?: string[]
}

export function canAccessReports(): boolean {
  // TODO: Implement actual permission logic
  // Example: return user.role === 'admin' || user.permissions.includes('reports')
  return true
}

export function canAccessSettings(user?: UserWithRole | null): boolean {
  return user?.role === "owner"
}

export function canCreateNew(): boolean {
  // TODO: Implement actual permission logic
  // Example: return user.permissions.includes('create')
  return true
}

/**
 * Refund action in Accounting: visible only if accounting module is enabled AND
 * user has permission accounting.refund (if RBAC exists) or role owner/assistant.
 */
export function canRefundAccounting(user: UserWithRole | null | undefined): boolean {
  if (!user) return false
  if (user.permissions?.includes("accounting.refund")) return true
  return user.role === "owner" || user.role === "assistant"
}

export function canVerifyPayments(user: UserWithRole | null | undefined): boolean {
  if (!user) return false
  if (user.permissions?.includes("payments.verify")) return true
  return user.role === "owner"
}