import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'

import { styles } from '@/styles/botaoHome';

const BotaoHome = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
                <Ionicons name="home-outline" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.text}>Voltar para Home</Text>
            </TouchableOpacity>
        </View>
    );
}

export default BotaoHome;