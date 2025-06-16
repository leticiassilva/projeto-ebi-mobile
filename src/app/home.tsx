import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "@/services/sqliteService";
import { styles } from "@/styles/home";

function Home() {
  const params = useLocalSearchParams<{
    educadoraId?: string; // Define o tipo do parâmetro esperado
    // outros parâmetros...
  }>();

  // Acessa o valor do parâmetro
  const educadoraId = params.educadoraId;
  console.log("Home - educadoraId:", educadoraId);

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
          onPress={() => router.push(`/sala?educadoraId=${educadoraId}`)}
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
          onPress={() => router.push("/cadastro-crianca")}
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
          onPress={() => router.push("/visualizar-crianca")}
        >
          <MaterialIcons
            name="list"
            size={32}
            color="#E91E63"
            style={styles.cardIcon}
          />
          <Text style={styles.cardText}>Crianças Cadastradas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/cadastrar-educadora")}
        >
          <MaterialIcons
            name="school"
            size={32}
            color="#007AFF"
            style={styles.cardIcon}
          />
          <Text style={styles.cardText}>Cadastrar Educadora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/gerar-relatorio")}
        >
          <MaterialIcons
            name="description"
            size={32}
            color="#007AFF"
            style={styles.cardIcon}
          />
          <Text style={styles.cardText}>Gerar Relatório</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.historicoButton}
          onPress={() => router.push("/historico-salinhas")}
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
