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
        flexDirection: "row" as const,
        alignItems: "center" as const,
    },
    backButtonText: {
        color: "#1E88E5",
        fontSize: 16,
        marginLeft: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E91E63',
        textAlign: 'center',
        marginRight: 24,
    },
    loading: {
        flex: 1,
        justifyContent: "center" as const,
        alignItems: "center" as const,
    },
    emptyText: {
        textAlign: "center" as const,
        fontSize: 16,
        color: "#666",
        marginTop: 20,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FFE082',
        paddingBottom: 8,
    },
    data: {
        fontSize: 16,
        fontWeight: "bold" as const,
        color: '#1E88E5',
    },
    colete: {
        fontSize: 14,
        color: '#E91E63',
    },
    cardBody: {
        flexDirection: "row" as const,
        justifyContent: "space-around" as const,
        marginBottom: 12,
    },
    horario: {
        alignItems: "center" as const,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    hora: {
        fontSize: 16,
        fontWeight: "bold" as const,
        color: '#1E88E5',
    },
    educadora: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic" as const,
    },
});