import { UserRole, ROLE_PERMISSIONS } from '@/types/permissions';

export const usePermissions = (role: UserRole) => {
  const hasPermission = (permission: string): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  };

  return {
    hasPermission,
    permissions: ROLE_PERMISSIONS[role] || []
  };
};