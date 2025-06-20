import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getHistoricoSalinhas,
  SalinhaHistoricoCompleto,
  CriancaHistorico,
} from "@/services/sqliteService";
import { styles } from "@/styles/historico-salinhas";
import { usePermissions } from "@/hooks/use-permissions";
import { UserRole } from "@/types/permissions";

export default function HistoricoSalinhas() {
  const [historico, setHistorico] = useState<SalinhaHistoricoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dataAtual, setDataAtual] = useState("");
  const [dataFormatada, setDataFormatada] = useState("");
  const [educadoraId, setEducadoraId] = useState<number | undefined>(undefined);

  const params = useLocalSearchParams<{
    educadoraId?: string;
    role: UserRole;
  }>();

  const role = params.role as UserRole;

  const { hasPermission } = usePermissions(role);

  const carregarHistorico = async () => {
    try {
      setLoading(true);

      // 1. Configurar a data
      const hoje = new Date();
      const dataHoje = format(hoje, "yyyy-MM-dd");
      const dataFormatadaTexto = format(hoje, "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });

      setDataAtual(dataHoje);
      setDataFormatada(dataFormatadaTexto);

      // 2. Buscar histórico do dia
      const historicoDia = await getHistoricoSalinhas(dataHoje);

      console.log("Total de salinhas encontradas:", historicoDia.length);

      // 3. Ordenar por horário de abertura
      const historicoOrdenado = historicoDia.sort((a, b) => {
        // Primeiro por status (abertas primeiro)
        if (a.status === "aberta" && b.status === "fechada") return -1;
        if (a.status === "fechada" && b.status === "aberta") return 1;

        // Depois por hora de abertura (mais recente primeiro)
        return b.horaAbertura.localeCompare(a.horaAbertura);
      });

      setHistorico(historicoOrdenado);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      Alert.alert("Erro", "Não foi possível carregar o histórico de salinhas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregarHistorico();
  };

  const verificarCriancasSemSaida = (criancas: CriancaHistorico[]) => {
    return criancas.some((crianca) => !crianca.horaSaida);
  };

  const renderCrianca = (crianca: CriancaHistorico) => (
    <View style={styles.criancaItem} key={`crianca-${crianca.id}`}>
      <View style={styles.criancaHeader}>
        <Text style={styles.criancaNome}>{crianca.nomeCrianca}</Text>
        <Text style={styles.criancaColete}>Colete: {crianca.codigoColete}</Text>
      </View>
      <View style={styles.criancaHorarios}>
        <Text style={styles.criancaHorario}>
          Entrada: {crianca.horaEntrada}
        </Text>
        {crianca.horaSaida ? (
          <Text style={styles.criancaHorario}>Saída: {crianca.horaSaida}</Text>
        ) : (
          <Text style={[styles.criancaHorario, styles.semSaida]}>
            Sem saída registrada
          </Text>
        )}
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
          <MaterialIcons name="arrow-back" size={24} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Salinhas</Text>
      </View>

      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{dataFormatada}</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1E88E5"
          style={styles.loading}
        />
      ) : (
        <ScrollView
          style={styles.historicoList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {historico.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma salinha registrada hoje
            </Text>
          ) : (
            historico.map((item) => (
              <View key={`salinha-${item.id}`} style={styles.historicoItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.educadoraName}>{item.nomeEducadora}</Text>
                  <Text
                    style={[
                      styles.status,
                      item.status === "aberta"
                        ? styles.statusAberta
                        : styles.statusFechada,
                    ]}
                  >
                    {item.status === "aberta" ? "Aberta" : "Fechada"}
                  </Text>
                </View>

                <View style={styles.horarios}>
                  <Text style={styles.horarioText}>
                    Abertura: {item.horaAbertura}
                  </Text>
                  {item.horaFechamento && (
                    <Text style={styles.horarioText}>
                      Fechamento: {item.horaFechamento}
                    </Text>
                  )}
                </View>

                {item.observacoes && (
                  <Text style={styles.observacoes}>{item.observacoes}</Text>
                )}

                <View style={styles.criancasContainer}>
                  <Text style={styles.criancasTitle}>
                    Crianças ({item.criancas.length})
                  </Text>
                  {item.criancas.length > 0 ? (
                    item.criancas.map(renderCrianca)
                  ) : (
                    <Text style={styles.semCriancas}>
                      Nenhuma criança registrada neste período
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
