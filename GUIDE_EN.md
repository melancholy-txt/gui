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

## Step 5: Add Store

## 5.1 Create user-inventory.js context
Inside `src/` create new folder `contexts` then create a new file `user-inventory.js`. Inside this file define:

```js
import React, { createContext, useContext, useState } from 'react';

const UserInventoryContext = createContext({
    score: 0,
    items: [],
    addItem: () => { },
    removeItem: () => { },
    updateScore: () => { },
});

export function UserInventoryProvider({ children }) {
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([]);

    const addItem = item => {
        setItems(prev => [...prev, item]);
    };

    const removeItem = itemId => {
        setItems(prev => prev.filter(({ id }) => itemId !== id));
    };

    const updateScore = amount => {
        setScore(prev => prev + amount);
    };


    return (
        <UserInventoryContext.Provider value={{
            score,
            items,
            addItem,
            removeItem,
            updateScore
        }}>
            {children}
        </UserInventoryContext.Provider>
    );
}

export function useUserInventory() {
    return useContext(UserInventoryContext);
}
```
The `user-inventory.js` file implements a **React Context** for managing the user's game state in the BebeClicker app. It provides centralized state management for the player's score (Bebe count) and inventory of purchased items, allowing components throughout the app to access and modify this data. This context is essential for the shop system, enabling components to read the score, check ownership, and perform buy/sell transactions. It ensures state consistency across the app. `App.js` must be wrapped with `UserInventoryProvider` to access the context.

## 5.2 App.js navigation + implementation of context
Install new package for navigation using:
```bash
npm i @react-navigation/native-stack
```
Now edit the `App.js` to this:

```js
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
```
- **Navigation setup**
  - Uses `NavigationContainer` from `@react-navigation/native`
  - Creates a native stack navigator with `createNativeStackNavigator()`
  - Defines two screens:
    - `Home` → `HomeScreen`
    - `Store` → `Store`

- **Context provider**
  - Wraps the entire app inside `UserInventoryProvider` from `./src/contexts/user-inventory`
  - This makes `score`, `items`, and inventory methods available to all child screens

- **App layout**
  - `HomeScreen` launches first via `initialRouteName="Home"`
  - The home screen hides its header with `options={{ headerShown: false }}`

## 5.3 Create Store.js page
In `src/screens` create new file `Store.js`:
```js
import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import ShopItem from '../components/ShopItem';
import { menu } from '../ShopList';
import { globalStyles } from '../styles';
import { useUserInventory } from '../contexts/user-inventory';

export default function Store() {
    const { score } = useUserInventory();
    return (
        <ScrollView>
            <View style={{ ...globalStyles.rowContainer, padding: 10 }}>
                <Text style={globalStyles.text}>
                    Bebe Count:
                </Text>
                <Text style={globalStyles.boldText}>
                    {score} Bebe
                </Text>
            </View>
            {
                menu?.map(item => <ShopItem key={item?.id} item={item} />)
            }
        </ScrollView>
    );
}
```
- **Score Display**: Shows the user's current "Bebe Count" at the top of the screen, retrieved from the user inventory context.
- **Shop Items List**: Renders a scrollable list of all shop items from the `menu` array. Each item is displayed using the `ShopItem` component, allowing users to buy or sell items based on their current score and inventory.
- **Scrollable Interface**: Uses a `ScrollView` to handle long lists of items, ensuring all content is accessible on smaller screens.

## 5.4 Create Store Shopping list
In folder `src/` create a file `Menu.js` where we will be defining items available in Store.js:

```js
export const menu = [
    {
        id: 1,
        name: "Better Clicker",
        price: 60,
        description: "+5 Bebe per click",
        bonus: 5,
        image: require("../assets/betterclicker.jpg")
    },
    {
        id: 2,
        name: "Background Animation",
        price: 1,
        background: require("../assets/background1.mp4"),
        image: require("../assets/background_bebe.png")
    },
    {
        id: 3,
        name: "Monster",
        price: 500,
        description: "+100 Bebe per click",
        bonus: 100,
        image: require("../assets/monster.png")
    },
    {
        id: 4,
        name: "Prettier Bebe",
        price: 1,
        image: require("../assets/lepsibebe.png")
    },
    {
        id: 5,
        name: "Background Animation 2",
        price: 2000,
        background: require("../assets/background2.mp4"),
        image: require("../assets/background2.jpg")
    },
    {
        id: 6,
        name: "ULTIMATE UPGRADE",
        price: 5000,
        description: "???",
        image: require("../assets/ultimate.jpg")
    }
]
```

## 5.5 Create ShopItem
In `src/` folder create a new folder `components` and add new `ShopItem.js`. Inside `ShopItem.js`:
```js

import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { globalStyles } from '../styles'
import { useUserInventory } from '../contexts/user-inventory'

export default function ShopItem({ item }) {
    const { id, name, price, description, image } = item;
    const { items, addItem, removeItem, score, updateScore } = useUserInventory();

    const buyItem = () => {
        if (score < price) return;

        addItem(item);
        updateScore(-price);
    }

    const sellItem = () => {
        removeItem(id);
        updateScore(price);
    }

    return (
        <View style={{ ...globalStyles.columnContainer, padding: 10 }}>
            <Image
                source={image}
                resizeMode='contain'
                style={{
                    height: 100,
                    width: 100,
                    borderRadius: 15
                }}
            />
            <Text style={globalStyles.text}>
                {name} {description && `(${description})`}
            </Text>
            <View style={globalStyles.rowContainer}>
                {
                    items?.find(item => item.id === id) ?
                        <TouchableOpacity style={globalStyles.button} onPress={sellItem}>
                            <Text style={globalStyles.buttonText}>
                                Sell
                            </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={globalStyles.button} onPress={buyItem}>
                            <Text style={globalStyles.buttonText}>
                                Buy
                            </Text>
                        </TouchableOpacity>
                }

                <Text style={globalStyles.boldText}>
                    {price} Bebe
                </Text>
            </View>
        </View>
    )
}
```
This component encapsulates the shop item logic, so the store screen can simply render a list of `ShopItem` components. It keeps item purchase/sale behavior isolated and reusable across the app.

- Renders one item card with:
  - item image
  - item name
  - optional description
  - item price
- Shows either a **Buy** or **Sell** button depending on whether the item is already in the user's inventory
- Updates the global game state when an item is bought or sold
- On buy:
  - adds the item to inventory
  - subtracts the item price from the score
- On sell:
  - removes the item from inventory
  - adds the item price back to the score

## 5.6 Edit HomeScreen.js
Inside `HomeScreen.js` we will change the code to this:

```js
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
```
Install expo-av for video support:
```bash
npm i expo-av
```

- Replaced local score state with shared inventory context:
  - now imports `useUserInventory`
  - uses `score`, `updateScore`, and `items` from context

- Added background video support:
  - imports `Video` and `ResizeMode` from `expo-av`
  - `getBackground()` renders latest purchased background item

- Added conditional visuals based on inventory:
  - special cookie image if `"Prettier Bebe"` is owned
  - monster image appears if `"Monster"` is owned

- Added navigation to Store:
  - `Go To Store` button uses `navigation.navigate("Store")`

## Step 6: Save progress to phone storage

## 6.1 Install async-storage library
In terminal run this:
```bash
npm i @react-native-async-storage/async-storage
```

## 6.2 Edit user-inventory.js context
In `user-inventory.js` add AsyncStorage and a storage key:
```js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@bebe_clicker_save";
```

## 6.3 Add functions to user-inventory.js context
In `user-inventory.js` inside `<UserInventoryProvider>` add these functions:

```js
const [grandmas, setGrandmas] = useState(0);

const saveData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save game:", error);
  }
};

const loadData = async () => {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (!json) return;

            const saved = JSON.parse(json);

            if (saved.score != null)
                setScore(saved.score);

            if (Array.isArray(saved.items))
                setItems(saved.items);

            if (saved.grandmas != null)
                setGrandmas(saved.grandmas);
        } catch (error) {
            console.warn("Failed to load game:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        saveData({ score, items, grandmas });
    }, [score, items, grandmas]);
```

And edit the return value to:

```js
 return (
        <UserInventoryContext.Provider value={{
            score,
            items,
            addItem,
            removeItem,
            updateScore,
            grandmas,
            setGrandmas
        }}>
            {children}
        </UserInventoryContext.Provider>
    );
```
In `HomeScreen.js` get rid of `cookiesPerSecond`:

```js
const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
```

We will be using grandmas to add point per second. We changed these lines:
```js
const { score, updateScore, items, grandmas, setGrandmas } = useUserInventory();
const [cookiesPerClick, setCookiesPerClick] = useState(1);
const GRANDMA_COST = 50;

useEffect(() => {
	if (grandmas <= 0) return;

	const timerId = setInterval(() => {
		updateScore(grandmas);
	}, 1000);

	return () => clearInterval(timerId);
}, [grandmas]);

const handleBuyGrandma = () => {
	if (score < GRANDMA_COST) return;

	updateScore(-GRANDMA_COST);
	setGrandmas((prev) => prev + 1);
};
```

## Step 7: Ultimate upgrade + polishing

## 7.1 add mp4 to assets
To `assets/` add `ultimate.mp4`.

## 7.1 edit StoreMenu
In `StoreMenu.js` edit the item ULTIMATE UPGRADE to:
```js
{
    id: 6,
    name: "ULTIMATE UPGRADE",
    price: 10000,
    description: "???",
    bonus: 10000000,
    grandmas: 10000,
    image: require("../assets/ultimate.jpg"),
    background: require("../assets/ultimate.mp4")
}
```

## 7.2 edit ShopItem
In `ShopItem.js` add condition to `js buyItem()` function. Now it looks like this:

```js
const { items, addItem, removeItem, score, updateScore, setGrandmas } = useUserInventory();

const buyItem = () => {
    if (score < price) return;

    addItem(item);
    updateScore(-price);

    if (grandmas)
        setGrandmas(grandmas);
}
```

## 7.2 edit HomeScreen
In `HomeScreen.js` we edit styles to this:

```js
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	title: { fontSize: 36, fontWeight: "800", marginBottom: 12 },
	whiteTitle: { fontSize: 36, fontWeight: "800", marginBottom: 12, color: "#fff" },
	score: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
	whiteScore: { fontSize: 28, fontWeight: "700", marginBottom: 6, color: "#fff" },
	meta: { fontSize: 16, marginBottom: 8 },
	whiteMeta: { fontSize: 16, marginBottom: 8, color: "#fff" },
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
```

Then add new state and edit `useEffect` listening to items like this:
```js
	const [isUltimate, setIsUltimate] = useState(false);

	useEffect(() => {
		const bonusClick = items.reduce((newClickCount, { bonus }) => bonus ? newClickCount + bonus : newClickCount, 1);

		setCookiesPerClick(bonusClick);

		const ultimate = items.find(({ name }) => name === "ULTIMATE UPGRADE")

		if (ultimate)
			setIsUltimate(true);

	}, [items]);
```

In `<View />` component we find the main text and edit it to this:

```js
<Text style={isUltimate ? styles.whiteTitle : styles.title}>Bebe Clicker</Text>
<Text style={isUltimate ? styles.whiteScore : styles.score}>Cookies: {score}</Text>
<Text style={isUltimate ? styles.whiteMeta : styles.meta}>Per click: +{cookiesPerClick}</Text>
<Text style={isUltimate ? styles.whiteMeta : styles.meta}>Per second: +{grandmas}</Text>
<Text style={isUltimate ? styles.whiteMeta : styles.meta}>Grandmas: {grandmas}</Text>
```

## 7.3 Format score in HomeScreen
Lastly in `HomeScreen.js` we add new function:

```js
const formatNumber = num => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(".0", "") + " mil";
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(".0", "") + "k";
    } else {
        return num.toString();
    }
};
```

And edit it in render:
```js
<Text style={isUltimate ? styles.whiteScore : styles.score}>Cookies: {formatNumber(score)}</Text>
```

---

## Common mistakes (and quick fixes)

- **Score not updating on click:** ensure `onPress={handleCookiePress}` is on `TouchableOpacity`.
- **Animation not visible:** ensure you switched to `Animated.Image` and use `transform: [{ scale }]`.
- **Passive income too fast:** check interval is `1000` ms, not `100`.
- **Income doubles unexpectedly:** verify `clearInterval(timerId)` is returned from the effect.

---

You now have a solid game core and are ready for Step 5 (shop screen + navigation).
