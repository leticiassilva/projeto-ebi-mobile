import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        flexDirection:'row',
        backgroundColor: theme.colors.pastelBlue,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        shadowColor: theme.colors.white,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
    },
    text: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '600',

    },
    icon: {
        marginRight: 8,
    },
});


