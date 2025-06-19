import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { styles } from "@/styles/cadastro";
import { useState, useEffect } from "react";
import { getDB, cadastrarEducadora } from "@/services/sqliteService";

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [igreja, setIgreja] = useState("");
  const [regiao, setRegiao] = useState("");
  const [bloco, setBloco] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        "Erro",
        "Não foi possível inicializar o banco de dados. Por favor, reinicie o aplicativo.",
        [{ text: "OK", onPress: () => router.push("/") }]
      );
    }
  };

  async function handleCadastro() {
    if (!dbInitialized) {
      Alert.alert("Erro", "Aguarde a inicialização do banco de dados.");
      return;
    }

    if (
      !nome.trim() ||
      !email.trim() ||
      !senha.trim() ||
      !igreja.trim() ||
      !regiao.trim() ||
      !bloco.trim()
    ) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      const result = await cadastrarEducadora(
        nome,
        "coordenadora",
        email,
        senha,
        igreja,
        regiao,
        bloco
      );

      if (result.success) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
          { text: "OK", onPress: () => router.push("/") },
        ]);
      } else {
        Alert.alert(
          "Erro",
          result.error === "Email já cadastrado"
            ? "Este email já está cadastrado. Por favor, use outro email ou faça login."
            : result.error || "Erro ao cadastrar. Por favor, tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro inesperado. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta de Educadora</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#757575" />
          <TextInput
            placeholder="Nome completo"
            style={styles.input}
            placeholderTextColor="#757575"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#757575" />
          <TextInput
            placeholder="Seu e-mail"
            style={styles.input}
            placeholderTextColor="#757575"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#757575" />
          <TextInput
            placeholder="Sua senha"
            style={styles.input}
            placeholderTextColor="#757575"
            secureTextEntry={!showPassword}
            value={senha}
            onChangeText={setSenha}
            autoCapitalize="none"
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"} 
              size={24}
              color="#757575"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="church" size={24} color="#757575" />
          <TextInput
            placeholder="Igreja"
            style={styles.input}
            placeholderTextColor="#757575"
            value={igreja}
            onChangeText={setIgreja}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="location-on" size={24} color="#757575" />
          <TextInput
            placeholder="Região"
            style={styles.input}
            placeholderTextColor="#757575"
            value={regiao}
            onChangeText={setRegiao}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="grid-view" size={24} color="#757575" />
          <TextInput
            placeholder="Bloco"
            style={styles.input}
            placeholderTextColor="#757575"
            value={bloco}
            onChangeText={setBloco}
            autoCapitalize="characters"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => router.push("/")} disabled={loading}>
            <Text style={styles.footerButtonText}>Fazer login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
