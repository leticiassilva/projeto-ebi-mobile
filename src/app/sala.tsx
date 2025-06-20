import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";

import { styles } from "@/styles/sala";
import {
  registrarFechamentoSalinha,
  getSalinhaAtiva,
  getEntradasAtivasSalinha,
  registrarSaidaCrianca,
  getHistoricoSalinhas,
  getEducadoras,
  abrirSalinha,
} from "@/services/sqliteService";
import { UserRole } from "@/types/permissions";
import { usePermissions } from "@/hooks/use-permissions";

interface SalinhaAtiva {
  id: number;
  educadoraId: number;
  nomeEducadora: string;
  status: "aberta" | "fechada";
}

interface CriancaEntrada {
  id: number;
  nomeCrianca: string;
  codigoColete: string;
  responsavel: string;
  educadora: string;
  horaEntrada: string;
}

export default function SalaScreen() {
  const [criancas, setCriancas] = useState<CriancaEntrada[]>([]);
  const [salinhaAtiva, setSalinhaAtiva] = useState<SalinhaAtiva | null>(null);
  const [educadoraId, setEducadoraId] = useState<number | null>(null);
  const [educadoraNome, setEducadoraNome] = useState<string>("");

  const params = useLocalSearchParams<{
    educadoraId?: string;
    role: UserRole;
  }>();
  const role = params.role as UserRole;
  const { hasPermission } = usePermissions(role);

  useEffect(() => {
    if (params.educadoraId) {
      setEducadoraId(Number(params.educadoraId));
    }
  }, [params.educadoraId]);

  useEffect(() => {
    const inicializarSala = async () => {
      if (!educadoraId) return;
      try {
        const educadoras = await getEducadoras();
        const educadoraSelecionada = educadoras.find(
          (e) => e.id === educadoraId
        );
        if (educadoraSelecionada) {
          setEducadoraNome(educadoraSelecionada.nome);
        }
        await carregarCriancas();
      } catch (error) {
        console.error("Erro ao inicializar sala:", error);
        Alert.alert("Erro", "Não foi possível inicializar a sala");
      }
    };

    inicializarSala();
  }, [educadoraId]);

  const carregarCriancas = async (manterSalinhaAtiva = false) => {
    try {
      const dataHoje = moment().format("YYYY-MM-DD");
      if (!educadoraId) return;

      const salinha = await getSalinhaAtiva(educadoraId, dataHoje);
      if (!manterSalinhaAtiva && salinha) {
        setSalinhaAtiva(salinha);
      }

      const entradasAtivas = await getEntradasAtivasSalinha(dataHoje);
      setCriancas(
        entradasAtivas.map((entrada) => ({
          id: entrada.id!,
          nomeCrianca: entrada.nomeCrianca,
          codigoColete: entrada.codigoColete,
          responsavel: entrada.responsavel,
          educadora: entrada.educadora,
          horaEntrada: entrada.horaEntrada,
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados da sala");
    }
  };

  const handleAbrirSalinha = async (idEducadora: number) => {
    try {
      console.log("Tentando abrir salinha para educadora:", idEducadora);
      const dataHoje = moment().format("YYYY-MM-DD");
      const salinhaExistente = await getSalinhaAtiva(idEducadora, dataHoje);

      if (salinhaExistente) {
        setSalinhaAtiva(salinhaExistente);
        await carregarCriancas(true);
        Alert.alert("Aviso", "Já existe uma salinha aberta para hoje");
        return;
      }

      const result = await abrirSalinha(idEducadora);
      console.log("Resultado da abertura da salinha:", result);

      if (result.success) {
        const novaSalinha: SalinhaAtiva = {
          id: result.id!,
          educadoraId: idEducadora,
          nomeEducadora: educadoraNome,
          status: "aberta",
        };
        setSalinhaAtiva(novaSalinha);
        await carregarCriancas(true);
        Alert.alert(
          "Sucesso",
          `Salinha aberta por ${educadoraNome || "Educadora"}`
        );
      } else {
        Alert.alert("Erro", result.error || "Não foi possível abrir a salinha");
      }
    } catch (error) {
      console.error("Erro ao abrir salinha:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar abrir a salinha");
    }
  };

  const handleFecharSalinha = async () => {
    try {
      if (!salinhaAtiva || !educadoraId) {
        Alert.alert("Erro", "Não há salinha aberta para fechar");
        return;
      }

      if (criancas.length > 0) {
        Alert.alert(
          "Erro",
          "Todas as crianças devem ter saída registrada antes de fechar a salinha"
        );
        return;
      }

      const dataHoje = moment().format("YYYY-MM-DD");
      const result = await registrarFechamentoSalinha(salinhaAtiva.id);

      if (result.success) {
        const historico = await getHistoricoSalinhas(dataHoje);
        const salinhaFechada = historico.find((s) => s.id === salinhaAtiva.id);

        if (salinhaFechada) {
          const criancasUnicas = salinhaFechada.criancas.filter(
            (crianca, index, self) =>
              index === self.findIndex((c) => c.id === crianca.id)
          );

          const detalhes = `
          Educadora: ${salinhaFechada.nomeEducadora}
          Total de Crianças: ${criancasUnicas.length}

          Crianças: ${criancasUnicas
            .map((c) => `- ${c.nomeCrianca} (Colete: ${c.codigoColete})`)
            .join("\n")}
        `;

          Alert.alert("Salinha Fechada", detalhes, [
            {
              text: "OK",
              onPress: () => {
                router.push(`/home?educadoraId=${educadoraId}&role=${role}`);
              },
            },
          ]);
        }
      } else {
        Alert.alert("Erro", result.error || "Erro ao fechar salinha");
      }
    } catch (error) {
      console.error("Erro ao fechar salinha:", error);
      Alert.alert("Erro", "Não foi possível fechar a salinha");
    }
  };

  const handleSaidaCrianca = async (crianca: CriancaEntrada) => {
    try {
      const horaAtual = moment().format("HH:mm");
      const result = await registrarSaidaCrianca(crianca.id, horaAtual);

      if (result.success) {
        await carregarCriancas(true);
        Alert.alert("Sucesso", `Saída de ${crianca.nomeCrianca} registrada!`);
      } else {
        Alert.alert(
          "Erro",
          result.error || "Não foi possível registrar a saída"
        );
      }
    } catch (error) {
      console.error("Erro ao registrar saída:", error);
      Alert.alert("Erro", "Não foi possível registrar a saída");
    }
  };

  const renderCrianca = ({ item }: { item: CriancaEntrada }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.nome}>{item.nomeCrianca}</Text>
        <Text style={styles.colete}>Colete: {item.codigoColete}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Responsável:</Text>
          <Text style={styles.value}>{item.responsavel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Educadora:</Text>
          <Text style={styles.value}>{item.educadora}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Entrada:</Text>
          <Text style={styles.value}>{item.horaEntrada}</Text>
        </View>
        <TouchableOpacity
          style={styles.saidaButton}
          onPress={() => handleSaidaCrianca(item)}
        >
          <MaterialIcons name="exit-to-app" size={20} color="#FF3B30" />
          <Text style={styles.saidaButtonText}>Registrar Saída</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>Crianças na Sala</Text>
      </View>

      <View style={styles.actionsContainer}>
        {!salinhaAtiva ? (
          <TouchableOpacity
            style={styles.abrirSalinhaButton}
            onPress={() => educadoraId && handleAbrirSalinha(educadoraId)}
          >
            <MaterialIcons name="meeting-room" size={24} color="#fff" />
            <Text style={styles.abrirSalinhaButtonText}>Abrir Salinha</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.fecharSalinhaButton}
            onPress={handleFecharSalinha}
          >
            <MaterialIcons name="meeting-room" size={24} color="#fff" />
            <Text style={styles.fecharSalinhaButtonText}>Fechar Salinha</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.novaEntradaButton}
          onPress={() =>
            router.push(
              `/entrada-crianca?educadoraId=${educadoraId}&salinhaId=${salinhaAtiva?.id}&role=${role}`
            )
          }
          disabled={!salinhaAtiva}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.novaEntradaButtonText}>Adicionar Criança</Text>
        </TouchableOpacity>
      </View>

      {criancas.length > 0 ? (
        <FlatList
          data={criancas}
          renderItem={renderCrianca}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyText}>
          {salinhaAtiva
            ? "Nenhuma criança presente na sala"
            : "Abra uma salinha para adicionar crianças"}
        </Text>
      )}
    </View>
  );
}
