export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';
import Order from '../../models/order';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        try {
            const userId = getState().auth.userId;
            //async code
            //fetch() -> Use for any type of http request, .json especification of firebase
            const response = await fetch(`https://rn-app-shop-c6ecd.firebaseio.com/orders/${userId}.json`);
            if (!response.ok) {
                throw new Error('Something went wrong with firebase!');
            }

            const resData = await response.json();
            let loadedOrders = [];

            for (const key in resData) {
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date)))
            }
            dispatch({ type: SET_ORDERS, orders: loadedOrders })
        } catch (err) {
            //send error to a custom analitycs server
            throw err;
        }
    }
};

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        try {
            const token = getState().auth.token;
            const userId = getState().auth.userId;
            const date = new Date();
            const response = await fetch(`https://rn-app-shop-c6ecd.firebaseio.com/orders/${userId}.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    //no needs an id because Firebase generates one
                    cartItems,
                    totalAmount,
                    date: date.toISOString()
                })
            });
            const resData = await response.json();
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            dispatch({
                type: ADD_ORDER,
                orderData: {
                    id: resData.name,
                    items: cartItems,
                    amount: totalAmount,
                    date: date
                }
            })
        } catch (err) {
            throw err;
        }

    }
}