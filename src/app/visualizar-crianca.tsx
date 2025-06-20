import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  ChildData,
  getChildren,
  getEntradas,
  removeChild,
} from "@/services/sqliteService";
import { styles } from "@/styles/visualizar-crianca";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { usePermissions } from "@/hooks/use-permissions";
import { UserRole } from "@/types/permissions";

interface ChildWithEntrada extends ChildData {
  ultimaEntrada?: {
    dataEntrada: string;
    horaEntrada: string;
    horaSaida?: string;
    educadora: string;
  };
}

export default function VisualizarCrianca() {
  const [criancas, setCriancas] = useState<ChildWithEntrada[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useLocalSearchParams<{
    educadoraId?: string;
    role: UserRole;
  }>();

  const role = params.role as UserRole;
  const educadoraId = params.educadoraId;

  const { hasPermission } = usePermissions(role);

  useEffect(() => {
    carregarCriancas();
  }, []);

  const carregarCriancas = async () => {
    try {
      setLoading(true);
      const dados = await getChildren();
      const entradasHoje = await getEntradas({
        data: moment().format("DD-MM-YYYY"),
      });

      const criancasComUltimaEntrada = dados.map((crianca) => {
        const ultimaEntrada = entradasHoje.find(
          (e) => e.childId === crianca.id
        );
        return {
          ...crianca,
          ultimaEntrada: ultimaEntrada
            ? {
                dataEntrada: ultimaEntrada.dataEntrada,
                horaEntrada: ultimaEntrada.horaEntrada,
                horaSaida: ultimaEntrada.horaSaida,
                educadora: ultimaEntrada.educadora,
              }
            : undefined,
        };
      });

      setCriancas(criancasComUltimaEntrada);
    } catch (error) {
      console.error("Erro ao carregar crianças:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverCrianca = async (childId: number, nomeCrianca: string) => {
    Alert.alert(
      "Confirmar Remoção",
      `Tem certeza que deseja remover ${nomeCrianca}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await removeChild(childId);
              Alert.alert("Sucesso", "Criança removida com sucesso");
              carregarCriancas();
            } catch (error) {
              if (error instanceof Error) {
                Alert.alert("Erro", error.message);
              } else {
                Alert.alert("Erro", "Erro ao remover criança");
              }
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ChildWithEntrada }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.nome}>{item.nomeCrianca}</Text>
        <Text style={styles.idade}>{item.idade} anos</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Responsável:</Text>
          <Text style={styles.value}>{item.responsavel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Telefone:</Text>
          <Text style={styles.value}>{item.telefoneResponsavel}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>CPF:</Text>
          <Text style={styles.value}>{item.cpfResponsavel}</Text>
        </View>
        {item.ultimaEntrada && (
          <View style={styles.entradaInfo}>
            <Text style={styles.entradaLabel}>Última Entrada:</Text>
            <Text style={styles.entradaHora}>
              {item.ultimaEntrada.horaEntrada}
            </Text>
            {item.ultimaEntrada.horaSaida && (
              <Text style={styles.saidaHora}>
                Saída: {item.ultimaEntrada.horaSaida}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.historicoButton}
          onPress={() =>
            router.push({
              pathname: "/historico-crianca",
              params: {
                childId: item.id,
                nomeCrianca: item.nomeCrianca,
                educadoraId: educadoraId,
                role: role,
              },
            })
          }
        >
          <MaterialIcons name="history" size={20} color="#007AFF" />
          <Text style={styles.historicoButtonText}>Ver Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removerButton}
          onPress={() => handleRemoverCrianca(item.id!, item.nomeCrianca)}
        >
          <MaterialIcons name="delete" size={20} color="#FF3B30" />
          <Text style={styles.removerButtonText}>Remover</Text>
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
        <Text style={styles.title}>Crianças Cadastradas</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loading}
        />
      ) : criancas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma criança cadastrada</Text>
      ) : (
        <FlatList
          data={criancas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || ""}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}
