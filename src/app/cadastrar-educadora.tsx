import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { usePermissions } from "@/hooks/use-permissions";
import { UserRole } from "@/types/permissions";

export default function CadastrarEducadora() {
  const params = useLocalSearchParams<{
    educadoraId?: string;
    role: UserRole;
  }>();

  const role = params.role as UserRole;
  const educadoraId = params.educadoraId;

  const { hasPermission } = usePermissions(role);

  useEffect(() => {
    router.push({
      pathname: "/gerenciar-educadoras",
      params: {
        educadoraId: educadoraId,
        role: role,
      },
    });
  }, []);

  return null;
}