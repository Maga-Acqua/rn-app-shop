import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token })
  }
};

export const signup = (email, password) => {
  return async dispatch => {
    try {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDqSkIYbONakK408ihTdyXgj8lM95gxxm0',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            //token: token,
            returnSecureToken: true
          })
        });
      const resData = await response.json();
      console.log(resData);
      dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);//calculates in miliseconds and then convert it again
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);

    } catch (err) {
      throw new Error('Could not Sign Up. Something went wrong!');
    }

  }
};

export const login = (email, password) => {
  return async dispatch => {
    try {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDqSkIYbONakK408ihTdyXgj8lM95gxxm0',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
          })
        });

      const resData = await response.json();
      console.log(resData);
      dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);//calculates in miliseconds and then convert it again
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);

    } catch (err) {
      /* Review handling errors!!
      const errorData = await response.json();
       const errorId = errorData.error.message;
       let message = 'Something went wrong!';

       if (errorId === 'EMAIL_NOT_FOUND') {
         message = 'Email not found!';
       } else if (errorId === 'INVALID_PASSWORD') {
         message = 'Invalid credentials.'
       }*/
      throw new Error('Could not Login. Something went wrong!');
    }
  }
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT }
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime)
  }
}

//To avoid reload all info
const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token: token,
    userId: userId,
    expirationDate: expirationDate.toISOString()
  }))
};