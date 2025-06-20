export type UserRole = 'admin' | 'coordenadora' | 'educadora';

export interface Permission {
  id: number;
  nome: string;
  descricao: string;
}

export interface UserPermissions {
  role: UserRole;
  permissions: string[];
}

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',        // Gerenciar usuários
  MANAGE_EDUCATORS: 'manage_educators',  // Gerenciar educadoras
  MANAGE_CHILDREN: 'manage_children',   // Gerenciar crianças
  MANAGE_ROOMS: 'manage_rooms',        // Gerenciar salas
  VIEW_REPORTS: 'view_reports',        // Visualizar relatórios
  VIEW_HISTORY: 'view_history',           // Visualizar histórico
  MANAGE_SYSTEM: 'manage_system'       // Gerenciar sistema
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_EDUCATORS,
    PERMISSIONS.MANAGE_CHILDREN,
    PERMISSIONS.MANAGE_ROOMS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.MANAGE_SYSTEM
  ],
  coordenadora: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_EDUCATORS,
    PERMISSIONS.MANAGE_CHILDREN,
    PERMISSIONS.MANAGE_ROOMS,
    PERMISSIONS.VIEW_HISTORY,
    PERMISSIONS.VIEW_REPORTS
  ],
  educadora: [
    PERMISSIONS.MANAGE_CHILDREN,
    PERMISSIONS.MANAGE_ROOMS,
    PERMISSIONS.VIEW_HISTORY
  ]
};