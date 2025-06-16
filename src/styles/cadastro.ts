import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 10,
    shadowColor: theme.colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.pastelBlueDark,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    marginRight: 5,
  },
  footerButtonText: {
    color: theme.colors.pastelBlueDark,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: theme.colors.pastelYellow,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.pastelYellowDark,
  },
  toggleButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
});

