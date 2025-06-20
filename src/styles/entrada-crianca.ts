import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDF3F6',
    padding: 20,
    minHeight: Dimensions.get('window').height,
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
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    flex: 1,
    marginRight: 24
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFE082',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1E88E5',
    marginBottom: 16,
    height: 48,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFE082',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 16,
    color: '#1E88E5',
  },
  observacoesInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    height: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#E91E63',
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
  },
});