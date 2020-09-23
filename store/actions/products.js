import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        try {
            const userId = getState().auth.userId;
            //async code
            //fetch() -> Use for any type of http request, .json especification of firebase
            const response = await fetch('https://rn-app-shop-c6ecd.firebaseio.com/products.json');
            if (!response.ok) {
                throw new Error('Something went wrong with firebase!');
            }

            const resData = await response.json();
            let loadedProducts = [];

            for (const key in resData) {
                loadedProducts.push(new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price))
            }
            dispatch({ type: SET_PRODUCTS, products: loadedProducts, userProducts: loadedProducts.filter( prod => prod.ownerId === userId) })
        } catch (err) {
            //send error to a custom analitycs server
            throw new Error(err.message);
        }
    }
};

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const response = await fetch(`https://rn-app-shop-c6ecd.firebaseio.com/products/${productId}.json?auth=${token}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            dispatch({
                type: DELETE_PRODUCT,
                pid: productId
            });
        } catch (err) {
            throw new Error(err.message);
        }

    }
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const userId = getState().auth.userId;
            //async code
            //fetch() -> Use for any type of http request, .json especification of firebase
            const response = await fetch(`https://rn-app-shop-c6ecd.firebaseio.com/products.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //no needs an id because Firebase generates one
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId : userId
                })
            });
            const resData = await response.json();
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            dispatch({
                type: CREATE_PRODUCT, productData: {
                    id: resData.name,
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId
                }
            });
        } catch (err) {
            throw new Error(err.message);
        }

    }
};

export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            await fetch(`https://rn-app-shop-c6ecd.firebaseio.com/products/${id}.json?auth=${token}`, {
                method: 'PATCH', //PATCH updates only the specifies places, PUT updates all
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //no needs an id because Firebase generates one
                    title,
                    description,
                    imageUrl
                })
            });
            dispatch({
                type: UPDATE_PRODUCT,
                pid: id,
                productData: {
                    title,
                    description,
                    imageUrl
                }
            });
        } catch (err) {
            throw new Error(err.message);
        }

    }
};