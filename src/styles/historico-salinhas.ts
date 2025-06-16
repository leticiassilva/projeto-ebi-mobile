import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#E91E63',
  },
  dateHeader: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historicoList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  historicoItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  educadoraName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  statusAberta: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
  statusFechada: {
    backgroundColor: '#FCE4EC',
    color: '#E91E63',
  },
  horarios: {
    marginBottom: 8,
  },
  horarioText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  observacoes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  fecharButton: {
    backgroundColor: '#E91E63',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12,
  },
  fecharButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  criancasContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  criancasTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  criancaItem: {
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  criancaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  criancaNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  criancaColete: {
    fontSize: 14,
    color: '#1E88E5',
  },
  criancaHorarios: {
    flexDirection: 'row',
    gap: 12,
  },
  criancaHorario: {
    fontSize: 12,
    color: '#666',
  },
  semCriancas: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  semSaida: {
    color: '#E91E63',
    fontStyle: 'italic',
  },
}); 