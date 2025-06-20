import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getHistoricoCrianca } from "@/services/sqliteService";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { UserRole } from "@/types/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { styles } from "@/styles/historico-crianca";

interface EntradaHistorico {
  id: number;
  dataEntrada: string;
  horaEntrada: string;
  horaSaida: string | null;
  codigoColete: string;
  educadora: string;
  nomeCrianca: string;
}

export default function HistoricoCrianca() {
  const { childId, nomeCrianca: nomeParam } = useLocalSearchParams();
  const [historico, setHistorico] = useState<EntradaHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useLocalSearchParams<{
    educadoraId?: string;
    role: UserRole;
  }>();

  const role = params.role as UserRole;
  const educadoraId = params.educadoraId;

  const { hasPermission } = usePermissions(role);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const dados = await getHistoricoCrianca(Number(childId));
      setHistorico(dados);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      Alert.alert("Erro", "Não foi possível carregar o histórico.");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return moment(data).format("DD/MM/YYYY");
  };

  const renderItem = ({ item }: { item: EntradaHistorico }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.data}>{formatarData(item.dataEntrada)}</Text>
        <Text style={styles.colete}>Colete: {item.codigoColete}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.horario}>
          <Text style={styles.label}>Entrada:</Text>
          <Text style={styles.hora}>{item.horaEntrada}</Text>
        </View>

        <View style={styles.horario}>
          <Text style={styles.label}>Saída:</Text>
          <Text style={styles.hora}>{item.horaSaida || "-"}</Text>
        </View>
      </View>

      <Text style={styles.educadora}>Educadora: {item.educadora}</Text>
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
      </View>

      <Text style={styles.title}>Histórico de {nomeParam}</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loading}
        />
      ) : historico.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma entrada registrada</Text>
      ) : (
        <FlatList
          data={historico}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};
