import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Rotas existentes */}
      <Stack.Screen name="index" />
      <Stack.Screen name="sala" />
      <Stack.Screen name="entrada-crianca" />
      <Stack.Screen name="historico-salinhas" />
      <Stack.Screen name="visualizar-crianca" />
      <Stack.Screen name="cadastro-crianca" />
      <Stack.Screen name="historico-crianca" />
      
      {/* Nova rota para gerenciar educadoras */}
      <Stack.Screen name="gerenciar-educadoras" />
    </Stack>
  );
} 