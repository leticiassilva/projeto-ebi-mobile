import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF3F6',
    padding: 20,
    justifyContent: 'center', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE082',
    paddingBottom: 8,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  idade: {
    fontSize: 16,
    color: '#E91E63',
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
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  entradaInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  entradaLabel: {
    fontSize: 14,
    color: '#FFC107',
    fontWeight: '500',
    marginBottom: 4,
  },
  entradaHora: {
    fontSize: 16,
    color: '#1E88E5',
    fontWeight: 'bold',
  },
  saidaHora: {
    fontSize: 14,
    color: '#E91E63',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFE082',
  },
  historicoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  historicoButtonText: {
    color: '#1E88E5',
    marginLeft: 4,
    fontSize: 14,
  },
  removerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  removerButtonText: {
    color: '#E91E63',
    marginLeft: 4,
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});