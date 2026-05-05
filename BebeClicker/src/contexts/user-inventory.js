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