import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

export default function HomeScreen() {
	const [score, setScore] = useState(0);
	const [cookiesPerClick, setCookiesPerClick] = useState(1);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Cookie Clicker</Text>
			<Text style={styles.score}>Cookies: {score.toString()}</Text>
			<Text style={styles.meta}>Per click: +{cookiesPerClick}</Text>

			<TouchableOpacity onPress={handleCookiePress} activeOpacity={0.8}>
				<Image
					source={require("../../assets/bebe.png")}
					style={styles.cookie}
				/>
			</TouchableOpacity>
		</View>
	);
}

const handleCookiePress = () => {
	setScore((prev) => prev + cookiesPerClick);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	title: { fontSize: 36, fontWeight: "800", marginBottom: 12 },
	score: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
	meta: { fontSize: 16, marginBottom: 20 },
	cookie: { width: 220, height: 220 },
});
