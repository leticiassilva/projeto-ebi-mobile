import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getDB, addChild } from "@/services/sqliteService";
import { styles } from "@/styles/cadastro-crianca";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { usePermissions } from "@/hooks/use-permissions";
import { UserRole } from "@/types/permissions";

export default function CadastrarCrianca() {
  const [nomeCrianca, setNomeCrianca] = useState("");
  const [idade, setIdade] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams<{
    educadoraId?: string;
    role: UserRole;
  }>();

  const role = params.role as UserRole;
  const educadoraId = params.educadoraId;
  console.log("Home - educadoraId:", educadoraId);
  console.log("Role atual:", role);

  const { hasPermission } = usePermissions(role);

  const formatarTelefone = (texto: string) => {
    // Remove tudo que não é número
    const numeros = texto.replace(/\D/g, "");

    // Aplica a máscara (00) 00000-0000
    let telefoneFormatado = numeros;
    if (numeros.length > 0) {
      telefoneFormatado = numeros.replace(/^(\d{2})/, "($1) ");
      if (numeros.length > 2) {
        telefoneFormatado = numeros.replace(/^(\d{2})(\d{5})/, "($1) $2");
      }
      if (numeros.length > 7) {
        telefoneFormatado = numeros.replace(
          /^(\d{2})(\d{5})(\d{4}).*/,
          "($1) $2-$3"
        );
      }
    }
    return telefoneFormatado;
  };

  const formatarCPF = (texto: string) => {
    // Remove tudo que não é número
    const numeros = texto.replace(/\D/g, "");

    // Aplica a máscara 000.000.000-00
    let cpfFormatado = numeros;
    if (numeros.length > 3) {
      cpfFormatado = numeros.replace(/^(\d{3})/, "$1.");
    }
    if (numeros.length > 6) {
      cpfFormatado = numeros.replace(/^(\d{3})(\d{3})/, "$1.$2.");
    }
    if (numeros.length > 9) {
      cpfFormatado = numeros.replace(/^(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-");
    }
    if (numeros.length > 9) {
      cpfFormatado = numeros.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2}).*/,
        "$1.$2.$3-$4"
      );
    }
    return cpfFormatado;
  };

  const handleTelefone = (texto: string) => {
    const telefoneFormatado = formatarTelefone(texto);
    if (telefoneFormatado.length <= 15) {
      setTelefoneResponsavel(telefoneFormatado);
    }
  };

  const handleCPF = (texto: string) => {
    const cpfFormatado = formatarCPF(texto);
    if (cpfFormatado.length <= 14) {
      setCpfResponsavel(cpfFormatado);
    }
  };

  useEffect(() => {
    const loadDB = async () => {
      await getDB();
    };
    loadDB();
  }, []);

  const formatarData = (texto: string) => {
    // Remove tudo que não é número
    const numeros = texto.replace(/\D/g, "");

    // Aplica a máscara DD/MM/AAAA
    let dataFormatada = numeros;
    if (numeros.length > 0) {
      dataFormatada = numeros.replace(/^(\d{2})/, "$1/");
      if (numeros.length > 2) {
        dataFormatada = numeros.replace(/^(\d{2})(\d{2})/, "$1/$2/");
      }
      if (numeros.length > 4) {
        dataFormatada = numeros.replace(/^(\d{2})(\d{2})(\d{4}).*/, "$1/$2/$3");
      }
    }
    return dataFormatada;
  };

  const validarData = (data: string) => {
    // Verifica se está no formato DD/MM/AAAA
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
      return false;
    }

    const [dia, mes, ano] = data.split("/").map(Number);
    const dataObj = new Date(ano, mes - 1, dia);

    // Verifica se é uma data válida
    if (
      dataObj.getFullYear() !== ano ||
      dataObj.getMonth() !== mes - 1 ||
      dataObj.getDate() !== dia
    ) {
      return false;
    }

    // Verifica se a data não é futura
    if (dataObj > new Date()) {
      return false;
    }

    return true;
  };

  const handleDataNascimento = (texto: string) => {
    const dataFormatada = formatarData(texto);
    if (dataFormatada.length <= 10) {
      setDataNascimento(dataFormatada);
    }
  };

  const handleSubmit = async () => {
    if (
      !nomeCrianca ||
      !idade ||
      !dataNascimento ||
      !responsavel ||
      !telefoneResponsavel ||
      !cpfResponsavel
    ) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }

    if (!validarData(dataNascimento)) {
      Alert.alert(
        "Atenção",
        "Data de nascimento inválida! Use o formato DD/MM/AAAA"
      );
      return;
    }

    try {
      setLoading(true);
      // Converte a data para o formato AAAA-MM-DD antes de salvar
      const [dia, mes, ano] = dataNascimento.split("/");
      const dataFormatoBanco = `${ano}-${mes}-${dia}`;

      await addChild({
        nomeCrianca,
        idade: Number(idade),
        dataNascimento: dataFormatoBanco,
        responsavel,
        telefoneResponsavel,
        cpfResponsavel,
      });
      Alert.alert("Sucesso", "Criança cadastrada com sucesso!");
      router.push({
        pathname: "/home",
        params: {
          educadoraId: educadoraId,
          role: role,
        },
      });
    } catch (e) {
      Alert.alert("Erro", "Erro ao cadastrar criança.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.push(`/home?educadoraId=${educadoraId}&role=${role}`)
          }
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cadastro de Criança</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome da Criança*</Text>
        <TextInput
          style={styles.input}
          value={nomeCrianca}
          onChangeText={setNomeCrianca}
          placeholder="Digite o nome completo"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Idade*</Text>
        <TextInput
          style={styles.input}
          value={idade}
          onChangeText={setIdade}
          keyboardType="numeric"
          placeholder="Digite a idade"
          placeholderTextColor="#999"
          maxLength={2}
        />

        <Text style={styles.label}>Data de Nascimento* (DD/MM/AAAA)</Text>
        <TextInput
          style={styles.input}
          value={dataNascimento}
          onChangeText={handleDataNascimento}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={styles.label}>Responsável*</Text>
        <TextInput
          style={styles.input}
          value={responsavel}
          onChangeText={setResponsavel}
          placeholder="Nome do responsável"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Telefone do Responsável*</Text>
        <TextInput
          style={styles.input}
          value={telefoneResponsavel}
          onChangeText={handleTelefone}
          keyboardType="numeric"
          placeholder="(00) 00000-0000"
          placeholderTextColor="#999"
          maxLength={15}
        />

        <Text style={styles.label}>CPF do Responsável*</Text>
        <TextInput
          style={styles.input}
          value={cpfResponsavel}
          onChangeText={handleCPF}
          keyboardType="numeric"
          placeholder="000.000.000-00"
          placeholderTextColor="#999"
          maxLength={14}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Cadastrar Criança"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
