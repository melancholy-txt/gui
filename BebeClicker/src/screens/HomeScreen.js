import React, { useEffect, useRef, useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	Animated,
} from "react-native";

export default function HomeScreen() {
	const [score, setScore] = useState(0);
	const [cookiesPerClick, setCookiesPerClick] = useState(1);
	const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
	const [grandmas, setGrandmas] = useState(0);
	const GRANDMA_COST = 50;

	useEffect(() => {
		if (cookiesPerSecond <= 0) return;

		const timerId = setInterval(() => {
			setScore((prev) => prev + cookiesPerSecond);
		}, 1000);

		return () => clearInterval(timerId);
	}, [cookiesPerSecond]);

	const scale = useRef(new Animated.Value(1)).current;

	const handleCookiePress = () => {
		setScore((prev) => prev + cookiesPerClick);
	};

	const handleBuyGrandma = () => {
		if (score < GRANDMA_COST) return;

		setScore((prev) => prev - GRANDMA_COST);
		setCookiesPerSecond((prev) => prev + 1);
		setGrandmas((prev) => prev + 1);
	};

	const animateIn = () => {
		Animated.spring(scale, {
			toValue: 0.9,
			useNativeDriver: true,
			speed: 25,
			bounciness: 4,
		}).start();
	};

	const animateOut = () => {
		Animated.spring(scale, {
			toValue: 1,
			useNativeDriver: true,
			speed: 20,
			bounciness: 6,
		}).start();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Cookie Clicker</Text>
			<Text style={styles.score}>Cookies: {score.toString()}</Text>
			<Text style={styles.meta}>Per click: +{cookiesPerClick}</Text>
			<Text style={styles.meta}>Per second: +{cookiesPerSecond}</Text>
			<Text style={styles.meta}>Grandmas: {grandmas}</Text>

			<TouchableOpacity
				onPress={handleCookiePress}
				activeOpacity={1}
				onPressIn={animateIn}
				onPressOut={animateOut}
			>
				<Animated.Image
					source={require("../../assets/bebe.png")}
					style={[styles.cookie, { transform: [{ scale }] }]}
				/>
			</TouchableOpacity>
			<TouchableOpacity style={styles.buyButton} onPress={handleBuyGrandma}>
				<Text style={styles.buyButtonText}>
                    Buys Grandma (+1/sec) - Cost: {GRANDMA_COST}
                </Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	title: { fontSize: 36, fontWeight: "800", marginBottom: 12 },
	score: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
	meta: { fontSize: 16, marginBottom: 8 },
	cookie: { width: 300, height: 300, marginTop: 100 },
	buyButton: {
		marginTop: 30,
		backgroundColor: "#7a4a2f",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 10,
	},
	buyButtonText: {
		color: "#fff",
		fontWeight: "700",
	},
});
