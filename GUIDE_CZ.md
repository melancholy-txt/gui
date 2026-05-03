# Český tutoriál

## Předpoklady

- Node.js LTS
- npm (součástí Node)
- Expo Go na telefonu (volitelné, ale užitečné)

---

## Krok 1: Správné nastavení projektu

### 1. Vytvoření nové Expo aplikace

```bash
npx create-expo-app CookieClicker --template blank
cd CookieClicker
```

### 2. Spuštění před provedením změn

```bash
npx expo start
```

Proč: tímto se ujistíte, že vaše lokální prostředí funguje správně, než začnete přidávat vlastní kód.

### 3. Instalace závislostí podle plánu

```bash
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
```

Navigaci a úložiště využijete v pozdějších krocích kompletního plánu, proto je nainstalujte rovnou.

### 4. Vytvoření čisté struktury zdrojových kódů

Vytvořte složky pro `components` a pro `utils` - buď přes grafické rozhraní, nebo pomocí příkazové řádky:

```bash
mkdir -p src/components src/screens src/utils
```

### 5. Udržujte `App.js` co nejjednodušší

Nahraďte výchozí uživatelské rozhraní jednoduchou kostrou:

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

Proč: `App.js` by měl sloužit primárně ke skládání obrazovek; samotná herní logika bude umístěna v `src/screens/HomeScreen.js`.

---

## Krok 2: Vytvoření základní klikací mechaniky

Cíl: Zobrazit skóre + obrázek sušenky a při stisknutí zvýšit skóre.

## 2.1 Vytvoření `src/screens/HomeScreen.js`

Začněte kostrou komponenty a importy:

```js
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function HomeScreen() {
	return <View />;
}
```

## 2.2 Zobrazení `HomeScreen` z `App.js`

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

Kontrolní bod: Po uložení by se na vašem telefonu měla zobrazit prázdná bílá obrazovka místo výchozího textu Expo. To znamená, že se vaše nová obrazovka úspěšně vykresluje!

## 2.3 Přidání herního stavu

Uvnitř komponenty `HomeScreen` přidejte dvě stavové proměnné:

```js
const [score, setScore] = React.useState(0);
const [cookiesPerClick] = React.useState(1);
```

- `score`: aktuální celkový počet sušenek
- `cookiesPerClick`: kolik sušenek přidá jedno klepnutí

## 2.4 Vykreslení uživatelského rozhraní

Nahraďte `return <View />;` následujícím kódem:

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

## 2.5 Přidání funkce pro zpracování kliknutí

```js
const handleCookiePress = () => {
	setScore((prev) => prev + cookiesPerClick);
};
```

Použijte funkcionální formu `setScore(prev => ...)`, abyste předešli problémům se zastaralým stavem (stale state).

## 2.6 Přidání pouze základních stylů

Přidejte blok `StyleSheet.create` s těmito klíči:

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

Barvy můžete upravit později; nejprve se zaměřte na chování. Kontrolní bod: klepnutí na sušenku by nyní mělo při každém stisku zvýšit skóre.

---

## Krok 3: Přidání animace jako zpětné vazby pro kliknutí

Cíl: Sušenka se zmenší při stisknutí a vrátí se do původní velikosti po uvolnění.

## 3.1 Přidání importu pro `Animated`

Aktualizujte své importy z React Native:

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

## 3.2 Přidání animované hodnoty pro měřítko (scale)

Uvnitř `HomeScreen`:

```js
const scale = React.useRef(new Animated.Value(1)).current;
```

- `1` = normální velikost
- použití `useRef` zachová stejnou animovanou hodnotu i během opětovného vykreslování (renders)

## 3.3 Přidání animací pro stisknutí a uvolnění

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

## 3.4 Připojení těchto funkcí k oblasti sušenky

Aktualizujte `TouchableOpacity`:

```js
<TouchableOpacity
  onPress={handleCookiePress}
  onPressIn={animateIn}
  onPressOut={animateOut}
  activeOpacity={1}
>
```

## 3.5 Vykreslení animované sušenky

Nahraďte `<Image ... />` následujícím kódem:

```js
<Animated.Image
	source={{ uri: "https://cdn-icons-png.flaticon.com/512/1047/1047711.png" }}
	style={[styles.cookie, { transform: [{ scale }] }]}
/>
```

Kontrolní bod: stisknutí by nyní mělo působit fyzicky a responzivně.

---

## Krok 4: Přidání pasivního příjmu pomocí časovače

Cíl: Počet sušenek se každou sekundu zvyšuje na základě zakoupených vylepšení.

## 4.1 Přidání stavu pro pasivní produkci

Uvnitř `HomeScreen`:

```js
const [cookiesPerSecond, setCookiesPerSecond] = React.useState(0);
const [grandmas, setGrandmas] = React.useState(0);
const GRANDMA_COST = 50;
```

## 4.2 Vytvoření pasivní smyčky (`useEffect`)

```js
React.useEffect(() => {
	if (cookiesPerSecond <= 0) return;

	const timerId = setInterval(() => {
		setScore((prev) => prev + cookiesPerSecond);
	}, 1000);

	return () => clearInterval(timerId);
}, [cookiesPerSecond]);
```

Proč na tomto tvaru záleží:

- Efekt se znovu spustí, když se změní `cookiesPerSecond`.
- Funkce pro úklid (cleanup) zabraňuje tomu, aby se na sebe vrstvilo více intervalů.
- Funkcionální forma `setScore` udržuje aktualizace spolehlivé.

## 4.3 Přidání funkce pro nákup Babičky (Grandma)

```js
const handleBuyGrandma = () => {
	if (score < GRANDMA_COST) return;

	setScore((prev) => prev - GRANDMA_COST);
	setCookiesPerSecond((prev) => prev + 1);
	setGrandmas((prev) => prev + 1);
};
```

Toto je vaše první smyčka pro nákup vylepšení:

1. Ověřte dostatek měny
2. Utraťte sušenky
3. Zvyšte produkci

## 4.4 Přidání pasivních statistik do uživatelského rozhraní

Blízko textu se skóre:

```js
<Text style={styles.meta}>Per second: +{cookiesPerSecond}</Text>
<Text style={styles.meta}>Grandmas: {grandmas}</Text>
```

## 4.5 Přidání tlačítka pro nákup pod sušenku

```js
<TouchableOpacity style={styles.buyButton} onPress={handleBuyGrandma}>
	<Text style={styles.buyButtonText}>
		Buy Grandma (+1/sec) - Cost: {GRANDMA_COST}
	</Text>
</TouchableOpacity>
```

Přidejte styly pro tlačítko:

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

Kontrolní bod:

1. Klikejte na sušenku, dokud nedosáhnete 50.
2. Kupte jednu Babičku.
3. Skóre by se nyní mělo automaticky zvyšovat o 1 každou sekundu.

---

## Časté chyby (a rychlá řešení)

- **Skóre se při kliknutí neaktualizuje:** ujistěte se, že `onPress={handleCookiePress}` je nastaveno na komponentě `TouchableOpacity`.
- **Animace není viditelná:** ujistěte se, že jste přešli na komponentu `Animated.Image` a používáte vlastnost `transform: [{ scale }]`.
- **Pasivní příjem je příliš rychlý:** zkontrolujte, zda je interval nastaven na `1000` ms a ne na `100`.
- **Příjem se neočekávaně zdvojnásobuje:** ověřte si, že z efektu správně vracíte úklidovou funkci `clearInterval(timerId)`.

---

Nyní máte solidní jádro hry a jste připraveni na Krok 5 (obrazovka obchodu + navigace).
