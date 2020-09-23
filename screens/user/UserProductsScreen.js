import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Platform, Button, Alert, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const userProducts = useSelector(state => state.products.userProducts)
    const dispatch = useDispatch();

    const editProductHandler = useCallback( async (id) => {
        setError(null);
        setIsLoading(true);
        props.navigation.navigate('EditProduct', {productId: id})
        setIsLoading(false);
    }, []);

    const deleteHandler = useCallback( async (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            { text: 'No', style: 'default' },
            { text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(productsActions.deleteProduct(id));}}
        ])
    }, [dispatch]);

    /* useEffect(() => {
        if (error) {
            Alert.alert('An error ocurred!', error, [{text: 'Ok'}])
        }
    }, [error]); */

    if (isLoading) {
        return (<View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primaryColor} />
        </View>);
    };
    if (!isLoading && userProducts.length === 0) {
        return (<View style={styles.centered}>
            <Text style={styles.text}>No products found. Maybe you can start adinng some new ones!</Text>
        </View>);
    };
    return (
        <FlatList
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => { 
                        editProductHandler(itemData.item.id);
                    }}>
                <Button color={Colors.primaryColor} title="Edit" onPress={() => {
                    editProductHandler(itemData.item.id);
                }} />
                <Button color={'red'} title="Delete" onPress={() => {
                    deleteHandler(itemData.item.id);
                }} />
                </ProductItem>        }
        />);
};

UserProductsScreen.navigationOptions = navData => {
    return {
    headerTitle: 'Your Products',
    headerLeft: () =>
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer()
                    }}
                />
            </HeaderButtons>,
    headerRight: () =>
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
            title='Add'
            iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            onPress={() => {
                navData.navigation.navigate('EditProduct')
            }}
        />
    </HeaderButtons>
    }
}
const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'song',
        fontSize: 18,
        margin: 20,
        textAlign: 'center'
    }
});
export default UserProductsScreen;