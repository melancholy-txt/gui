import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 16
    },
    boldText: {
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "center"
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: "#6e6e6e"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
    },
    columnContainer: {
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        rowGap: 10,
        marginTop: 10
    },
    rowContainer: {
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
});