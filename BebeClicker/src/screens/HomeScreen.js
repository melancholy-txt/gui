import React, { useEffect, useRef, useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	Animated,
} from "react-native";
import { globalStyles } from "../styles";
import { useUserInventory } from "../contexts/user-inventory";
import { Video, ResizeMode } from 'expo-av';

export default function HomeScreen({ navigation }) {
	const { score, updateScore, items } = useUserInventory();
	const [cookiesPerClick, setCookiesPerClick] = useState(1);
	const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
	const [grandmas, setGrandmas] = useState(0);
	const GRANDMA_COST = 50;

	useEffect(() => {
		if (cookiesPerSecond <= 0) return;

		const timerId = setInterval(() => {
			updateScore(cookiesPerSecond);
		}, 1000);

		return () => clearInterval(timerId);
	}, [cookiesPerSecond]);

	useEffect(() => {
		const bonusClick = items.reduce((newClickCount, { bonus }) => bonus ? newClickCount + bonus : newClickCount, 1);

		setCookiesPerClick(bonusClick);
	}, [items]);

	const scale = useRef(new Animated.Value(1)).current;

	const handleCookiePress = () => {
		updateScore(cookiesPerClick);
	};

	const handleBuyGrandma = () => {
		if (score < GRANDMA_COST) return;

		updateScore(-GRANDMA_COST);
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

	const getBackground = () => {
		const background = items?.filter(({ background }) => background);

		if (background.length <= 0)
			return null


		const source = background[background?.length - 1]?.background;

		return (
			<Video
				source={source}
				style={StyleSheet.absoluteFill}
				shouldPlay
				isLooping
				isMuted
				resizeMode={ResizeMode.STRETCH}
			/>
		)
	}

	return (
		<View style={styles.container}>
			{
				getBackground()
			}
			<Text style={styles.title}>Bebe Clicker</Text>
			<Text style={styles.score}>Cookies: {score}</Text>
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
					source={items.find(({ name }) => name === "Prettier Bebe") ? items.find(({ id }) => id === 4).image : require("../../assets/bebe.png")}
					style={[styles.cookie, { transform: [{ scale }] }]}
					resizeMode={"contain"}
				/>
			</TouchableOpacity>
			<TouchableOpacity style={styles.buyButton} onPress={handleBuyGrandma}>
				<Text style={styles.buyButtonText}>
					Buys Grandma (+1/sec) - Cost: {GRANDMA_COST}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity style={{ ...globalStyles.button, marginTop: 10 }} onPress={() => { navigation.navigate("Store") }}>
				<Text style={globalStyles.buttonText}>
					Go To Store
				</Text>
			</TouchableOpacity>
			{
				items.find(({ name }) => name === "Monster") &&
				<Image
					source={items.find(({ name }) => name === "Monster")?.image}
					style={{
						width: 100,
						height: 100,
						top: 160,
						right: 0,
						position: "absolute"
					}}
					resizeMode="contain"
				/>
			}
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
