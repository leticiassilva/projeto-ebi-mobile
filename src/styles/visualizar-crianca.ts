import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.colors.pastelBlueDark, // azul
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.pastelPink,
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FDF3F6', // rosa bem claro
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.pastelYellow, // amarelo claro
    paddingBottom: 8,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.pastelBlueDark, // azul
  },
  idade: {
    fontSize: 16,
    color: theme.colors.pastelPink, // rosa
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#555', // cinza escuro neutro
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  entradaInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF8E1', // amarelo bem claro
    borderRadius: 8,
  },
  entradaLabel: {
    fontSize: 14,
    color: theme.colors.pastelYellowDark, // amarelo
    fontWeight: '500',
    marginBottom: 4,
  },
  entradaHora: {
    fontSize: 16,
    color: theme.colors.pastelBlueDark, // azul
    fontWeight: 'bold',
  },
  saidaHora: {
    fontSize: 14,
    color: theme.colors.pastelPink, // rosa
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.pastelYellow, // amarelo claro
  },
  historicoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  historicoButtonText: {
    color: theme.colors.pastelBlueDark, // azul
    marginLeft: 4,
    fontSize: 14,
  },
  removerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  removerButtonText: {
    color: theme.colors.pastelPink, // rosa
    marginLeft: 4,
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});