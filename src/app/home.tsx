import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "@/services/sqliteService";
import { styles } from "@/styles/home";
import { PermissionGate } from "./components/permission-gate";
import { PERMISSIONS, UserRole } from "@/types/permissions";
import { usePermissions } from "@/hooks/use-permissions";

function Home() {
  const params = useLocalSearchParams<{
    educadoraId?: string;
    role: UserRole;
  }>();

  const role = params.role as UserRole;
  const educadoraId = params.educadoraId;
  console.log("Home - educadoraId:", educadoraId);
  console.log("Role atual:", role);

  const { hasPermission } = usePermissions(role);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro", "Erro ao sair da conta.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EBI Mobile</Text>
        <Text style={styles.subtitle}>Gerenciamento da Salinha EBI</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, styles.cardPrimary]}
          onPress={() =>
            router.push(`/sala?educadoraId=${educadoraId}&role=${role}`)
          }
        >
          <MaterialIcons
            name="people"
            size={32}
            color="#fff"
            style={styles.cardIcon}
          />
          <Text style={[styles.cardText, styles.cardTextWhite]}>
            Salinha EBI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push(
              `/cadastro-crianca?educadoraId=${educadoraId}&role=${role}`
            )
          }
        >
          <MaterialIcons
            name="person-add"
            size={32}
            color="#007AFF"
            style={styles.cardIcon}
          />
          <Text style={styles.cardText}>Cadastrar Criança</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push(
              `/visualizar-crianca?educadoraId=${educadoraId}&role=${role}`
            )
          }
        >
          <MaterialIcons
            name="list"
            size={32}
            color="#E91E63"
            style={styles.cardIcon}
          />
          <Text style={styles.cardText}>Crianças Cadastradas</Text>
        </TouchableOpacity>

        <PermissionGate role={role} permission={PERMISSIONS.MANAGE_EDUCATORS}>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(
                `/cadastrar-educadora?educadoraId=${educadoraId}&role=${role}`
              )
            }
          >
            <MaterialIcons
              name="school"
              size={32}
              color="#007AFF"
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>Cadastrar Educadora</Text>
          </TouchableOpacity>
        </PermissionGate>

        <PermissionGate role={role} permission={PERMISSIONS.VIEW_REPORTS}>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(
                `/gerar-relatorio?educadoraId=${educadoraId}&role=${role}`
              )
            }
          >
            <MaterialIcons
              name="description"
              size={32}
              color="#007AFF"
              style={styles.cardIcon}
            />
            <Text style={styles.cardText}>Gerar Relatório</Text>
          </TouchableOpacity>
        </PermissionGate>

        <TouchableOpacity
          style={styles.historicoButton}
          onPress={() =>
            router.push(
              `/historico-salinhas?educadoraId=${educadoraId}&role=${role}`
            )
          }
        >
          <MaterialIcons name="history" size={24} color="#fff" />
          <Text style={styles.historicoButtonText}>Histórico</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="exit-to-app" size={24} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Home;
