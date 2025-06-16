import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { MaskedTextInput } from "react-native-mask-text";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styles } from "@/styles/entrada-crianca";
import {
  getEducadoras,
  getChildren,
  registrarEntrada,
  EducadoraData,
  ChildData,
  getSalinhaAtiva,
} from "@/services/sqliteService";

interface Educadora {
  id: number;
  nome: string;
}

interface Crianca {
  id: number;
  nomeCrianca: string;
}

function EntradaCrianca() {
  // Recebe o ID da educadora da tela anterior
  const params = useLocalSearchParams<{
    educadoraId?: string;
    salinhaId?: string; // Define o tipo do parâmetro esperado
    // outros parâmetros...
  }>();

  const [codigoColete, setCodigoColete] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");
  const [educadoraId, setEducadoraId] = useState<number | "">("");
  const [salinhaId, setSalinhaId] = useState<number | "">("");
  const [childId, setChildId] = useState<number | "">("");
  const [observacoes, setObservacoes] = useState("");

  const [educadoras, setEducadoras] = useState<Educadora[]>([]);
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carrega educadoras e crianças
        const educadorasData = await getEducadoras();
        const criancasData = await getChildren();

        // Converte os dados para o formato necessário
        const educadorasFormatadas: Educadora[] = educadorasData
          .filter((e): e is Required<EducadoraData> => e.id !== undefined)
          .map((e) => ({ id: e.id, nome: e.nome }));

        const criancasFormatadas: Crianca[] = criancasData
          .filter((c): c is Required<ChildData> => c.id !== undefined)
          .map((c) => ({ id: c.id, nomeCrianca: c.nomeCrianca }));

        setEducadoras(educadorasFormatadas);
        setCriancas(criancasFormatadas);

        // Define data e hora atual
        const agora = new Date();
        setDataEntrada(moment(agora).format("DD/MM/YYYY"));
        setHoraEntrada(moment(agora).format("HH:mm"));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados necessários.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (params.educadoraId) setEducadoraId(Number(params.educadoraId));
    if (params.salinhaId) setSalinhaId(Number(params.salinhaId));
  }, [params]);
  console.log("EntradaCrianca - educadoraId:", params.educadoraId);
  console.log("EntradaCrianca - salinhaId:", params.salinhaId);

  const validarCampos = () => {
    if (!codigoColete.trim()) {
      Alert.alert("Erro", "Informe o código do colete");
      return false;
    }
    if (!educadoraId) {
      Alert.alert("Erro", "Selecione a educadora");
      return false;
    }
    if (!childId) {
      Alert.alert("Erro", "Selecione a criança");
      return false;
    }
    if (!moment(dataEntrada, "DD/MM/YYYY", true).isValid()) {
      Alert.alert("Erro", "Data de entrada inválida");
      return false;
    }
    if (!moment(horaEntrada, "HH:mm", true).isValid()) {
      Alert.alert("Erro", "Hora de entrada inválida");
      return false;
    }
    return true;
  };

  const handleEntrada = async () => {
    if (!validarCampos()) return;

    try {
      setLoading(true);

      // Converte data para formato ISO
      const dataFormatada = moment(dataEntrada, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );

      await registrarEntrada({
        salinhaId: Number(salinhaId),
        childId: Number(childId),
        educadoraId: Number(educadoraId),
        codigoColete,
        dataEntrada: dataFormatada,
        horaEntrada,
        observacoes,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        status: "ativo",
      });

      // Passa o ID da educadora para a próxima tela
      router.replace({
        pathname: "/sala",
        params: { educadoraId: educadoraId.toString() },
      });
    } catch (error) {
      console.error("Erro ao registrar entrada:", error);
      Alert.alert("Erro", "Não foi possível registrar a entrada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/sala")}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Registro de Entrada</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Código do Colete*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o código do colete"
          placeholderTextColor="#999"
          value={codigoColete}
          onChangeText={setCodigoColete}
          editable={!loading}
        />

        <Text style={styles.label}>Data de Entrada*</Text>
        <MaskedTextInput
          mask="99/99/9999"
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={dataEntrada}
          onChangeText={setDataEntrada}
          editable={!loading}
        />

        <Text style={styles.label}>Hora de Entrada*</Text>
        <MaskedTextInput
          mask="99:99"
          style={styles.input}
          placeholder="HH:mm"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={horaEntrada}
          onChangeText={setHoraEntrada}
          editable={!loading}
        />

        <Text style={styles.label}>Educadora*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={educadoraId}
            onValueChange={(itemValue) => setEducadoraId(itemValue)}
            style={styles.picker}
            enabled={!loading}
          >
            <Picker.Item label="Selecione uma educadora" value="" />
            {educadoras.map((educadora) => (
              <Picker.Item
                key={educadora.id}
                label={educadora.nome}
                value={educadora.id}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Criança*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={childId}
            onValueChange={(itemValue) => setChildId(itemValue)}
            style={styles.picker}
            enabled={!loading}
          >
            <Picker.Item label="Selecione uma criança" value="" />
            {criancas.map((crianca) => (
              <Picker.Item
                key={crianca.id}
                label={crianca.nomeCrianca}
                value={crianca.id}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.observacoesInput]}
          placeholder="Observações (opcional)"
          placeholderTextColor="#999"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={3}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleEntrada}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registrando..." : "Registrar Entrada"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default EntradaCrianca;
