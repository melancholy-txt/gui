# English Tutorial

## Prerequisites

- Node.js LTS
- npm (included with Node)
- Expo Go on a phone (optional, but useful)

---

## Step 1: Set up the project properly

### 1. Create a new Expo app

```bash
npx create-expo-app CookieClicker --template blank
cd CookieClicker
```

### 2. Start once before changing anything

```bash
npx expo start
```

Why: this confirms your local environment is healthy before adding your own code.

### 3. Install dependencies from the plan

```bash
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
```

You will use navigation and storage in later steps of the full plan, so install them now.

### 4. Create a clean source structure

Create folders for `components`, `screens` and for `utils` - either through the GUI or through bash;

```bash
mkdir -p src/components src/screens src/utils
```

### 5. Keep `App.js` minimal

Replace the default UI with a simple shell:

```js
import { StatusBar } from "expo-status-bar";

export default function App() {
	return (
		<>
			<StatusBar style="auto" />
		</>
	);
}
```

Why: `App.js` should mainly compose screens; gameplay logic will live in `src/screens/HomeScreen.js`.

---

## Step 2: Build the core click mechanic

Goal: show score + cookie image, and increase score when pressed.

## 2.1 Create `src/screens/HomeScreen.js`

Start with a component skeleton and imports:

```js
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

export default function HomeScreen() {
	return <View />;
}
```

## 2.2 Mount `HomeScreen` from `App.js`

```js
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
	return (
		<>
			<HomeScreen />
			<StatusBar style="auto" />
		</>
	);
}
```

Checkpoint: When you save, your phone will show a blank white screen instead of the Expo default text. This means your new screen is successfully rendering!

## 2.3 Add game state

Inside `HomeScreen`, add two state variables:

```js
const [score, setScore] = React.useState(0);
const [cookiesPerClick] = React.useState(1);
```

- `score`: current cookie total
- `cookiesPerClick`: how much one tap adds

## 2.4 Render the UI

Replace `return <View />;` with:

```js
return (
	<View style={styles.container}>
		<Text style={styles.title}>Cookie Clicker</Text>
		<Text style={styles.score}>Cookies: {score.toLocaleString()}</Text>
		<Text style={styles.meta}>Per click: +{cookiesPerClick}</Text>

		<TouchableOpacity onPress={handleCookiePress} activeOpacity={0.8}>
			<Image
				source={{
					uri: "https://cdn-icons-png.flaticon.com/512/1047/1047711.png",
				}}
				style={styles.cookie}
			/>
		</TouchableOpacity>
	</View>
);
```

## 2.5 Add a click handler

```js
const handleCookiePress = () => {
	setScore((prev) => prev + cookiesPerClick);
};
```

Use the functional `setScore(prev => ...)` form to avoid stale state issues.

## 2.6 Add only essential styles first

Add a `StyleSheet.create` block with these keys:

```js
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
	cookie: { width: 220, height: 220, marginTop: 200 },
});
```

You can tweak colors later; focus on behavior first. Checkpoint: tapping the cookie should increase the score every press.

---

## Step 3: Add tap animation feedback

Goal: cookie shrinks on press-in and returns on press-out.

## 3.1 Add `Animated` import

Update your React Native imports:

```js
import {
	Animated,
	View,
	Text,
	TouchableOpacity,
	Image,
	StyleSheet,
} from "react-native";
```

## 3.2 Add an animated scale value

Inside `HomeScreen`:

```js
const scale = React.useRef(new Animated.Value(1)).current;
```

- `1` = normal size
- using `useRef` keeps the same animated value across renders

## 3.3 Add press-in and press-out animations

```js
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
```

## 3.4 Attach those handlers to the cookie press area

Update your `TouchableOpacity`:

```js
<TouchableOpacity
  onPress={handleCookiePress}
  onPressIn={animateIn}
  onPressOut={animateOut}
  activeOpacity={1}
>
```

## 3.5 Render the cookie as animated

Replace `<Image ... />` with:

```js
<Animated.Image
	source={{ uri: "https://cdn-icons-png.flaticon.com/512/1047/1047711.png" }}
	style={[styles.cookie, { transform: [{ scale }] }]}
/>
```

Checkpoint: pressing should now feel tactile and responsive.

---

## Step 4: Add passive income with a timer

Goal: cookies increase every second from owned upgrades.

## 4.1 Add state for passive production

Inside `HomeScreen`:

```js
const [cookiesPerSecond, setCookiesPerSecond] = React.useState(0);
const [grandmas, setGrandmas] = React.useState(0);
const GRANDMA_COST = 50;
```

## 4.2 Create the passive loop (`useEffect`)

```js
React.useEffect(() => {
	if (cookiesPerSecond <= 0) return;

	const timerId = setInterval(() => {
		setScore((prev) => prev + cookiesPerSecond);
	}, 1000);

	return () => clearInterval(timerId);
}, [cookiesPerSecond]);
```

Why this shape matters:

- The effect reruns when `cookiesPerSecond` changes.
- Cleanup prevents multiple intervals from stacking.
- Functional `setScore` keeps updates reliable.

## 4.3 Add a purchase handler for Grandma

```js
const handleBuyGrandma = () => {
	if (score < GRANDMA_COST) return;

	setScore((prev) => prev - GRANDMA_COST);
	setCookiesPerSecond((prev) => prev + 1);
	setGrandmas((prev) => prev + 1);
};
```

This is your first upgrade loop:

1. Validate enough currency
2. Spend cookies
3. Increase production

## 4.4 Add passive stats to the UI

Near your score text:

```js
<Text style={styles.meta}>Per second: +{cookiesPerSecond}</Text>
<Text style={styles.meta}>Grandmas: {grandmas}</Text>
```

## 4.5 Add a buy button below the cookie

```js
<TouchableOpacity style={styles.buyButton} onPress={handleBuyGrandma}>
	<Text style={styles.buyButtonText}>
		Buy Grandma (+1/sec) - Cost: {GRANDMA_COST}
	</Text>
</TouchableOpacity>
```

Add button styles:

```js
buyButton: {
  marginTop: 12,
  backgroundColor: '#7a4a2f',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
},
buyButtonText: {
  color: '#fff',
  fontWeight: '700',
},
```

Checkpoint:

1. Click cookie until you reach 50.
2. Buy one Grandma.
3. Score should now increase by 1 every second automatically.

---

## Common mistakes (and quick fixes)

- **Score not updating on click:** ensure `onPress={handleCookiePress}` is on `TouchableOpacity`.
- **Animation not visible:** ensure you switched to `Animated.Image` and use `transform: [{ scale }]`.
- **Passive income too fast:** check interval is `1000` ms, not `100`.
- **Income doubles unexpectedly:** verify `clearInterval(timerId)` is returned from the effect.

---

You now have a solid game core and are ready for Step 5 (shop screen + navigation).
