import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getHistoricoCrianca } from '@/services/sqliteService';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

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

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const dados = await getHistoricoCrianca(Number(childId));
      setHistorico(dados);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return moment(data).format('DD/MM/YYYY');
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
          <Text style={styles.hora}>{item.horaSaida || '-'}</Text>
        </View>
      </View>
      
      <Text style={styles.educadora}>Educadora: {item.educadora}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Histórico de {nomeParam}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
      ) : historico.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma entrada registrada</Text>
      ) : (
        <FlatList
          data={historico}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 20,
    color: '#333',
  },
  loading: {
    flex: 1,
    justifyContent: 'center' as const,
  },
  emptyText: {
    textAlign: 'center' as const,
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  },
  data: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  colete: {
    fontSize: 14,
    color: '#666',
  },
  cardBody: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginBottom: 12,
  },
  horario: {
    alignItems: 'center' as const,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hora: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  educadora: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic' as const,
  },
};