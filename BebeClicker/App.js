import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import Store from "./src/screens/Store";
import { UserInventoryProvider } from "./src/contexts/user-inventory";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<UserInventoryProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
					<Stack.Screen name="Store" component={Store} />
				</Stack.Navigator>
			</NavigationContainer>
		</UserInventoryProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
