import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import { styles } from "../styles";
import { useState, useEffect } from "react";
import { getDB, loginEducadora } from "../services/sqliteService";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbIniialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await getDB();
      setDbInitialized(true);
    } catch (error) {
      console.error("Erro ao inicializar banco:", error);
      Alert.alert(
        "Erro no Banco de Dados",
        "Não foi possível inicializar o banco de dados."
      );
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      // Tenta fazer login
      const loginResult = await loginEducadora(email, senha);
      if (loginResult.success) {
        const educadoraId = loginResult.user?.id;
        console.log("Login bem-sucedido:", loginResult.user);
        console.log("Index - educadoraId:", educadoraId);
        router.replace(`/home?educadoraId=${educadoraId}`);
      } else {
        Alert.alert("Erro", "E-mail ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert(
        "Erro",
        "Erro ao conectar com o banco de dados. Por favor, reinicie o aplicativo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Faça login na sua conta</Text>

      <View style={styles.content}>
        <View style={styles.contentInput}>
          <MaterialIcons name="email" size={24} color="#757575" />
          <TextInput
            placeholder="Seu e-mail"
            style={styles.input}
            placeholderTextColor="#757575"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.contentInput}>
          <MaterialIcons name="lock" size={24} color="#757575" />
          <TextInput
            placeholder="Sua senha"
            style={styles.input}
            placeholderTextColor="#757575"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.buttonSignIn, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        <Text style={styles.buttonSignInText}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Não possui conta?</Text>
        <TouchableOpacity
          onPress={() => router.push("/cadastro")}
          disabled={loading}
        >
          <Text style={styles.footerButtonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
