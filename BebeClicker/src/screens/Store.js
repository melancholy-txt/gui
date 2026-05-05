import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import ShopItem from '../components/ShopItem';
import { menu } from '../StoreMenu';
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
