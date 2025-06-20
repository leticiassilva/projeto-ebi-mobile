import React from "react";
import { View } from "react-native";
import { UserRole, ROLE_PERMISSIONS } from "@/types/permissions";

interface PermissionGateProps {
  role: UserRole;
  permission: string;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  role,
  permission,
  children,
}) => {
  // Adicione logs para debug
  console.log("PermissionGate - Role:", role);
  console.log("PermissionGate - Permission:", permission);
  console.log(
    "PermissionGate - Has Permission:",
    role ? ROLE_PERMISSIONS[role]?.includes(permission) : false
  );

  if (!role || !ROLE_PERMISSIONS[role]?.includes(permission)) {
    return null;
  }

  return <>{children}</>;
};
