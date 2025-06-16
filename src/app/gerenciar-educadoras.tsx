import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, StyleSheet,TextInput,ScrollView} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getEducadoras, EducadoraData, removerEducadora, cadastrarEducadora } from '@/services/sqliteService';
import { styles } from '@/styles/gerenciar-educadoras';

export default function GerenciarEducadoras() {
  const [educadoras, setEducadoras] = useState<EducadoraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novaEducadora, setNovaEducadora] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'educadora' as 'educadora' | 'coordenadora'
  });

  const carregarEducadoras = async () => {
    try {
      setLoading(true);
      const todasEducadoras = await getEducadoras();
      setEducadoras(todasEducadoras);
    } catch (error) {
      console.error('Erro ao carregar educadoras:', error);
      Alert.alert('Erro', 'Não foi possível carregar as educadoras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEducadoras();
  }, []);

  const handleRemoverEducadora = (educadora: EducadoraData) => {
    Alert.alert(
      'Confirmar Remoção',
      `Deseja realmente remover a educadora ${educadora.nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            if (!educadora.id) return;

            setLoading(true);
            const resultado = await removerEducadora(educadora.id);

            if (resultado.success) {
              Alert.alert('Sucesso', 'Educadora removida com sucesso');
              carregarEducadoras();
            } else {
              Alert.alert('Erro', resultado.error || 'Não foi possível remover a educadora');
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  const handleCadastrarEducadora = async () => {
    // Validações básicas
    if (!novaEducadora.nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    try {
      setLoading(true);
      const resultado = await cadastrarEducadora(
        novaEducadora.nome, 
        novaEducadora.tipo, 
        novaEducadora.email || undefined, 
        novaEducadora.senha || undefined
      );

      if (resultado.success) {
        Alert.alert('Sucesso', 'Educadora cadastrada com sucesso');
        setModalVisivel(false);
        carregarEducadoras();
        // Limpar campos
        setNovaEducadora({
          nome: '',
          email: '',
          senha: '',
          tipo: 'educadora'
        });
      } else {
        Alert.alert('Erro', resultado.error || 'Não foi possível cadastrar a educadora');
      }
    } catch (error) {
      console.error('Erro ao cadastrar educadora:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar a educadora');
    } finally {
      setLoading(false);
    }
  };

  const renderItemEducadora = ({ item }: { item: EducadoraData }) => (
    <View style={styles.educadoraItem}>
      <View style={styles.educadoraInfo}>
        <Text style={styles.educadoraNome}>{item.nome}</Text>
        <Text style={styles.educadoraTipo}>
          {item.tipo === 'coordenadora' ? 'Coordenadora' : 'Educadora'}
        </Text>
        {item.email && <Text style={styles.educadoraEmail}>{item.email}</Text>}
      </View>
      <TouchableOpacity 
        style={styles.removerButton}
        onPress={() => handleRemoverEducadora(item)}
        disabled={item.tipo === 'coordenadora'}
      >
        <MaterialIcons 
          name="delete" 
          size={24} 
          color={item.tipo === 'coordenadora' ? '#CCCCCC' : '#FF0000'} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Educadoras</Text>
        <TouchableOpacity
          style={styles.adicionarButton}
          onPress={() => setModalVisivel(true)}
        >
          <MaterialIcons name="add" size={24} color="#1E88E5" />
        </TouchableOpacity>
      </View>

      <Text style={styles.listaTitle}>Educadoras Cadastradas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={styles.loading} />
      ) : (
        <FlatList
          data={educadoras}
          renderItem={renderItemEducadora}
          keyExtractor={(item) => item.id?.toString() || ''}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma educadora cadastrada</Text>
          }
          contentContainerStyle={styles.listaEducadoras}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cadastrar Nova Educadora</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome *</Text>
              <TextInput
                style={styles.input}
                value={novaEducadora.nome}
                onChangeText={(text) => setNovaEducadora({...novaEducadora, nome: text})}
                placeholder="Nome completo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email (opcional)</Text>
              <TextInput
                style={styles.input}
                value={novaEducadora.email}
                onChangeText={(text) => setNovaEducadora({...novaEducadora, email: text})}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha (opcional)</Text>
              <TextInput
                style={styles.input}
                value={novaEducadora.senha}
                onChangeText={(text) => setNovaEducadora({...novaEducadora, senha: text})}
                placeholder="Senha"
                secureTextEntry
              />
            </View>

            <View style={styles.tipoContainer}>
              <Text style={styles.label}>Tipo de Educadora</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity 
                  style={styles.radioButton}
                  onPress={() => setNovaEducadora({...novaEducadora, tipo: 'educadora'})}
                >
                  <View style={[
                    styles.radioCircle, 
                    novaEducadora.tipo === 'educadora' && styles.selectedRadio
                  ]} />
                  <Text style={styles.radioLabel}>Educadora</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.radioButton}
                  onPress={() => setNovaEducadora({...novaEducadora, tipo: 'coordenadora'})}
                >
                  <View style={[
                    styles.radioCircle, 
                    novaEducadora.tipo === 'coordenadora' && styles.selectedRadio
                  ]} />
                  <Text style={styles.radioLabel}>Coordenadora</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelarButton}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.modalCancelarButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSalvarButton}
                onPress={handleCadastrarEducadora}
              >
                <Text style={styles.modalSalvarButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 