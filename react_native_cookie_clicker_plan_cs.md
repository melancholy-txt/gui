# React Native Cookie Clicker: Plán vývoje

Tento plán vývoje popisuje vytvoření jednoduché hry „Cookie Clicker“ pomocí React Native. Projekt je navržen speciálně tak, aby ukázal nejdůležitější aspekty frameworku React Native, od základního vykreslování uživatelského rozhraní přes správu stavu, animace, navigaci až po lokální úložiště.

## Pokryté základní koncepty React Native
1. **Základní komponenty**: `View`, `Text`, `Image`, `TouchableOpacity`, `ScrollView`.
2. **Stav a životní cyklus (Hooks)**: `useState`, `useEffect`, `useRef`.
3. **Stylování**: `StyleSheet` a rozvržení Flexbox.
4. **Animace**: API React Native `Animated` pro interaktivní zpětnou vazbu.
5. **Navigace**: React Navigation (Stack nebo Tab) pro více obrazovek.
6. **Ukládání dat (Data Persistence)**: `AsyncStorage` pro lokální uložení stavu hry.

---

## Krok 1: Nastavení a inicializace projektu
*Cíl: Inicializovat prostředí a nainstalovat potřebné závislosti.*

* **Inicializace aplikace** pomocí Expo (doporučeno pro začátečníky/prototypování): `npx create-expo-app CookieClicker`.
* **Instalace závislostí**:
    * Navigace: `@react-navigation/native`, `@react-navigation/bottom-tabs` (a jejich požadované peer závislosti).
    * Úložiště: `@react-native-async-storage/async-storage`.
* **Struktura složek**: Vytvořte čistou strukturu (např. `/src/components`, `/src/screens`, `/src/utils`).

## Krok 2: Základní mechanika (Stav a základní UI)
*Cíl: Vykreslit hlavní obrazovku, klikací sušenku a počítadlo skóre.*

* **Vytvoření `HomeScreen`**: Použijte `View` s rozvržením flexbox pro vycentrování prvků.
* **Správa stavu**: Inicializujte `score` (skóre) a `cookiesPerClick` (sušenky za kliknutí) pomocí `useState`.
* **Komponenta sušenky**: Použijte `Image` (obrázek) obalený v `TouchableOpacity`.
* **Obsluha kliknutí**: Napište funkci, která po každém stisknutí `TouchableOpacity` zvýší `score` o hodnotu `cookiesPerClick`.
* **Stylování**: Použijte `StyleSheet.create` ke zvětšení textu a správnému nastavení velikosti obrázku sušenky.

## Krok 3: Přidání oživení (Animace)
*Cíl: Použít API `Animated`, aby se sušenka při stisknutí mírně zmenšila a poskytla tak hmatovou zpětnou vazbu.*

* **Animovaná hodnota**: Vytvořte `Animated.Value` (nebo použijte `useSharedValue`, pokud používáte Reanimated, ale standardní `Animated` pro základy postačí) inicializovanou na `1` (měřítko).
* **Události Press In/Out**: Upravte `TouchableOpacity` tak, aby používalo `onPressIn` a `onPressOut`.
* **Animace měřítka**:
    * Při stisknutí (press in): Animujte zmenšení měřítka na `0.9` pomocí `Animated.spring`.
    * Při uvolnění (press out): Animujte návrat měřítka na `1.0`.
* **Obalení obrázku**: Změňte komponentu sušenky `Image` na `Animated.Image` a aplikujte hodnotu měřítka na styly transformace (transform).

## Krok 4: Pasivní příjem (useEffect a časovače)
*Cíl: Zavedení „Babiček“ (Grandmas) nebo „Továren“ (Factories), které pečou sušenky automaticky v průběhu času.*

* **Nové stavové proměnné**: Přidejte do stavu `cookiesPerSecond` (sušenky za sekundu).
* **Herní smyčka**: Implementujte hook `useEffect`, který nastaví `setInterval`.
* **Logika intervalu**: Každých 1000 ms (1 sekunda) zvyšte celkové `score` o hodnotu `cookiesPerSecond`.
* **Úklid (Cleanup)**: Zásadní je zajistit, aby `useEffect` vracel úklidovou funkci (cleanup function), která zavolá `clearInterval`, čímž se zabrání únikům paměti (memory leaks).

## Krok 5: Obrazovka obchodu (React Navigation)
*Cíl: Přidat druhou obrazovku, kde mohou uživatelé utrácet své sušenky za vylepšení.*

* **Nastavení navigace**: Obalte aplikaci do `NavigationContainer` a nastavte `BottomTabNavigator` (spodní záložková navigace).
* **Vytvoření `ShopScreen`**: Sestavte komponentu pro novou obrazovku.
* **Sdílený stav**: Přesuňte stav (`score`, `cookiesPerClick`, `cookiesPerSecond`) nahoru do kořenové komponenty `App`, nebo použijte context provider (`React.Context`) ke sdílení stavu mezi domovskou obrazovkou a obchodem.
* **Seznam vylepšení**: Použijte `ScrollView` nebo `FlatList` k vykreslení seznamu dostupných vylepšení (např. „Kurzor (+1 za kliknutí)“, „Babička (+5 za sekundu)“).
* **Logika nákupu**: Napište funkce, které kontrolují, zda je `score >= cost` (skóre >= cena). Pokud ano, odečtěte cenu a zvyšte příslušný násobitel.

## Krok 6: Ukládání postupu (Uchovávání dat)
*Cíl: Zajistit, aby uživatel nepřišel o své sušenky, když aplikaci zavře.*

* **Implementace AsyncStorage**: Importujte `@react-native-async-storage/async-storage`.
* **Funkce pro ukládání**: Vytvořte pomocnou funkci, která převede herní stav (skóre, násobitele) na řetězec (stringify) a uloží jej pomocí `AsyncStorage.setItem`. Spouštějte ji pravidelně nebo vždy, když je zakoupeno vylepšení.
* **Funkce pro načítání**: Použijte `useEffect` s prázdným polem závislostí `[]` při načtení aplikace k volání `AsyncStorage.getItem`. Rozparsujte JSON a aktualizujte výchozí stavy.
* **Posluchač AppState** *(Volitelné, ale doporučené)*: Použijte API React Native `AppState` ke spuštění funkce ukládání konkrétně v momentě, kdy aplikace přejde do pozadí.

## Krok 7: Vyleštění a vzhled (Theming)
*Cíl: Dát aplikaci profesionální vzhled a ošetřit okrajové případy.*

* **Vlastní písma (Fonty)**: Načtěte zábavný herní font pomocí `expo-font`.
* **Formátování čísel**: Přidejte užitnou funkci pro formátování velkých čísel (např. převod `1 000 000` na `1 Milion`).
* **Zvukové efekty**: Zahrňte `expo-av` a přidejte jemný zvuk „křupnutí“ při každém klepnutí.

---
*Dodržením těchto kroků se dotknete každého základního pilíře vývoje v React Native a zároveň vytvoříte zábavnou, interaktivní aplikaci.*
