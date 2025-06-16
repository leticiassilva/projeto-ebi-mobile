import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, Platform, PermissionsAndroid, Linking } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SQLite, { ResultSet } from 'react-native-sqlite-storage';
import { styles } from '../styles/gerar-relatorio';

interface EntradaRelatorio {
  nomeCrianca: string;
  data_entrada: string;
  hora_entrada: string;
  nomeResponsavel: string;
  telefoneResponsavel: string;
  nomeEducadora: string;
}

export default function GerarRelatorio() {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Solicita as permissões básicas de armazenamento
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);

        const hasPermissions = 
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED;

        if (!hasPermissions) {
          Alert.alert(
            "Permissão Necessária",
            "Para gerar o PDF, é necessário conceder permissão de armazenamento nas configurações do aplicativo.",
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              {
                text: "Abrir Configurações",
                onPress: () => Linking.openSettings()
              }
            ]
          );
          return false;
        }
        return true;
      } catch (err) {
        console.error("Erro ao solicitar permissão:", err);
        Alert.alert(
          "Erro",
          "Não foi possível verificar as permissões de armazenamento. Por favor, verifique manualmente nas configurações do aplicativo."
        );
        return false;
      }
    }
    return true;
  };

  const generatePDF = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        return;
      }

      const db = await SQLite.openDatabase({
        name: 'maindb.db',
        location: 'default'
      });

      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      const result = await new Promise<EntradaRelatorio[]>((resolve, reject) => {
        db.transaction((tx: SQLite.Transaction) => {
          tx.executeSql(
            `SELECT c.nomeCrianca, e.dataEntrada as data_entrada, e.horaEntrada as hora_entrada, 
                    c.responsavel as nomeResponsavel,
                    c.telefoneResponsavel as telefoneResponsavel, ed.nome as nomeEducadora
             FROM entradas e
             JOIN children c ON e.childId = c.id
             JOIN educadoras ed ON e.educadoraId = ed.id
             WHERE e.dataEntrada BETWEEN ? AND ?
             ORDER BY e.dataEntrada DESC, e.horaEntrada DESC`,
            [formattedStartDate, formattedEndDate],
            (_, resultSet: ResultSet) => {
              const rows: EntradaRelatorio[] = [];
              for (let i = 0; i < resultSet.rows.length; i++) {
                rows.push(resultSet.rows.item(i));
              }
              resolve(rows);
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        });
      });

      if (result.length === 0) {
        Alert.alert('Aviso', 'Não há registros para o período selecionado.');
        return;
      }

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              h1 { text-align: center; color: #333; }
              .period { text-align: center; color: #666; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
              th { background-color: #f2f2f2; }
              tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h1>Relatório de Entradas - Salinha EBI</h1>
            <div class="period">
              Período: ${format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} até 
              ${format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <table>
              <tr>
                <th>Criança</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Responsável</th>
                <th>Telefone</th>
                <th>Educadora</th>
              </tr>
              ${result.map(item => `
                <tr>
                  <td>${item.nomeCrianca}</td>
                  <td>${format(new Date(item.data_entrada), 'dd/MM/yyyy')}</td>
                  <td>${item.hora_entrada}</td>
                  <td>${item.nomeResponsavel}</td>
                  <td>${item.telefoneResponsavel}</td>
                  <td>${item.nomeEducadora}</td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: `relatorio_entradas_${format(new Date(), 'dd_MM_yyyy')}`,
        directory: 'Download',
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      if (file?.filePath) {
        Alert.alert(
          'Sucesso!', 
          `Relatório gerado com sucesso!\n\nO arquivo foi salvo em:\n${file.filePath}\n\nVocê pode encontrá-lo na pasta Downloads do seu dispositivo.`,
          [{ 
            text: 'OK',
            onPress: () => {
              if (Platform.OS === 'android') {
                Linking.openURL('content://com.android.externalstorage.documents/document/primary%3ADownload')
                  .catch(() => {
                    console.log('Não foi possível abrir a pasta Downloads');
                  });
              }
            }
          }]
        );
      } else {
        throw new Error('Caminho do arquivo não gerado');
      }

    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erro', 
        'Ocorreu um erro ao gerar o relatório. Por favor, verifique se o aplicativo tem permissão para acessar o armazenamento nas configurações do seu dispositivo.'
      );
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from(
    { length: new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1
  );

  const DatePickerModal = ({ visible, onClose, onConfirm, initialDate }: any) => {
    const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

    const handleConfirm = () => {
      const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
      onConfirm(date);
      onClose();
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDay}
                style={styles.picker}
                onValueChange={(value) => setSelectedDay(value)}
              >
                {days.map((day) => (
                  <Picker.Item key={day} label={String(day)} value={day} />
                ))}
              </Picker>

              <Picker
                selectedValue={selectedMonth}
                style={styles.picker}
                onValueChange={(value) => setSelectedMonth(value)}
              >
                {months.map((month) => (
                  <Picker.Item
                    key={month}
                    label={format(new Date(2000, month - 1, 1), 'MMMM', { locale: ptBR })}
                    value={month}
                  />
                ))}
              </Picker>

              <Picker
                selectedValue={selectedYear}
                style={styles.picker}
                onValueChange={(value) => setSelectedYear(value)}
              >
                {years.map((year) => (
                  <Picker.Item key={year} label={String(year)} value={year} />
                ))}
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirm}>
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Gerar Relatório</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.dateContainer}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowStartDate(true)}
          >
            <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>Data Inicial</Text>
              <Text style={styles.dateValue}>
                {format(startDate, 'dd/MM/yyyy')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowEndDate(true)}
          >
            <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>Data Final</Text>
              <Text style={styles.dateValue}>
                {format(endDate, 'dd/MM/yyyy')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.generateButton}
          onPress={generatePDF}
        >
          <MaterialIcons name="description" size={24} color="#fff" />
          <Text style={styles.generateButtonText}>Gerar Relatório</Text>
        </TouchableOpacity>
      </View>

      <DatePickerModal
        visible={showStartDate}
        onClose={() => setShowStartDate(false)}
        onConfirm={(date: Date) => {
          setStartDate(date);
          setShowStartDate(false);
        }}
        initialDate={startDate}
      />

      <DatePickerModal
        visible={showEndDate}
        onClose={() => setShowEndDate(false)}
        onConfirm={(date: Date) => {
          setEndDate(date);
          setShowEndDate(false);
        }}
        initialDate={endDate}
      />
    </View>
  );
}