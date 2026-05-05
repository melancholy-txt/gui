import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@bebe_clicker_save";

const UserInventoryContext = createContext({
    score: 0,
    items: [],
    grandmas: [],
    setGrandmas: () => { },
    addItem: () => { },
    removeItem: () => { },
    updateScore: () => { },
});

export function UserInventoryProvider({ children }) {
    const [score, setScore] = useState(0);
    const [items, setItems] = useState([]);
    const [grandmas, setGrandmas] = useState(0);

    const saveData = async data => {
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
            updateScore,
            grandmas,
            setGrandmas
        }}>
            {children}
        </UserInventoryContext.Provider>
    );
}

export function useUserInventory() {
    return useContext(UserInventoryContext);
}