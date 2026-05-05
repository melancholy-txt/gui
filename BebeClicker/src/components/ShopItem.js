
import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { globalStyles } from '../styles'
import { useUserInventory } from '../contexts/user-inventory'

export default function ShopItem({ item }) {
    const { id, name, price, description, image, grandmas } = item;
    const { items, addItem, removeItem, score, updateScore, setGrandmas } = useUserInventory();

    const buyItem = () => {
        if (score < price) return;

        addItem(item);
        updateScore(-price);

        if (grandmas)
            setGrandmas(grandmas);
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
