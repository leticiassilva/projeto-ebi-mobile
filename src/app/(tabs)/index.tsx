import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from '@/styles/index';

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Novo botão para gerenciar educadoras */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/gerenciar-educadoras')}
      >
        <MaterialIcons name="people" size={24} color="white" />
        <Text style={styles.buttonText}>Gerenciar Educadoras</Text>
      </TouchableOpacity>
    </View>
  );
} 