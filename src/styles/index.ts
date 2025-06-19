import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF3F6',
    padding: 20,
    justifyContent: 'center',
  },
  ebiLogo: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 5,
    alignSelf: 'center',
  },
  header: {
    alignSelf: "flex-start",
    marginTop: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 40,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE082',
    marginBottom: 20,
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#1E88E5',
    fontSize: 16,
  },
  passwordToggle: {
    padding: 5,
    marginLeft: 10,
  },
  buttonSignIn: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSignInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ContainerSeparator: {
    width: "100%",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#FFE082',
    flex: 1,
  },
  ContainerSeparatorText: {
    color: '#FFC107',
    fontSize: 16,
    fontWeight: "500",
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
    color: '#E91E63',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});