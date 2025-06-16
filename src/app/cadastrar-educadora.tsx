import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { cadastrarEducadora, getEducadoras, EducadoraData, removerEducadora } from '@/services/sqliteService';
import { styles } from '@/styles/cadastrar-educadora';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CadastrarEducadora() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);  
  const [educadoras, setEducadoras] = useState<EducadoraData[]>([]);

  useEffect(() => {
    const loadDB = async () => {
      carregarEducadoras();
    };
    loadDB();
  }, []);

  const carregarEducadoras = async () => {
    try {
      const todasEducadoras = await getEducadoras();
      setEducadoras(todasEducadoras);
    } catch (error) {
      console.error('Erro ao carregar educadoras:', error);
      Alert.alert('Erro', 'Não foi possível carregar as educadoras');
    }
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite o nome da educadora!');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite o email da educadora!');
      return;
    }

    if (!senha.trim()) {
      Alert.alert('Atenção', 'Digite a senha da educadora!');
      return;
    }

    try {
      setLoading(true);
      const result = await cadastrarEducadora(nome, 'educadora', email, senha);
      
      if (result.success) {
        Alert.alert(
          'Sucesso', 
          'Educadora cadastrada!',
          [{ text: 'OK', onPress: () => {
            carregarEducadoras();
            setNome('');
            setEmail('');
            setSenha('');
          }}]
        );
      } else {
        Alert.alert('Erro', result.error || 'Erro ao cadastrar educadora.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Erro ao cadastrar educadora.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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

            try {
              setLoading(true);
              const resultado = await removerEducadora(educadora.id);

              if (resultado.success) {
                Alert.alert('Sucesso', 'Educadora removida com sucesso');
                carregarEducadoras();
              } else {
                Alert.alert('Erro', resultado.error || 'Não foi possível remover a educadora');
              }
            } catch (error) {
              console.error('Erro ao remover educadora:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao remover a educadora');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderItemEducadora = ({ item }: { item: EducadoraData }) => (
    <View style={styles.educadoraItem}>
      <View style={styles.educadoraInfo}>
        <Text style={styles.educadoraNome}>{item.nome}</Text>
        <Text style={styles.educadoraEmail}>{item.email}</Text>
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
          onPress={() => router.replace("/home")}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Educadoras</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Cadastrar Educadora</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Nome da Educadora*</Text>
            <TextInput 
              style={styles.input} 
              value={nome} 
              onChangeText={setNome}
              placeholder="Digite o nome completo"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Email da Educadora*</Text>
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail}
              placeholder="Digite o email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha da Educadora*</Text>
            <TextInput 
              style={styles.input} 
              value={senha} 
              onChangeText={setSenha}
              placeholder="Digite a senha"
              placeholderTextColor="#999"
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Cadastrar Educadora</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.listaContainer}>
          <Text style={styles.sectionTitle}>Educadoras Cadastradas</Text>
          <FlatList
            data={educadoras}
            renderItem={renderItemEducadora}
            keyExtractor={(item) => item.id?.toString() || ''}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma educadora cadastrada</Text>
            }
            contentContainerStyle={styles.listaEducadoras}
          />
        </View>
      </View>
    </ScrollView>
  );
}