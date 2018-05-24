import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import jwt_decode from "jwt-decode";

import { logoutUser } from "./actions/authActions";
import { SET_CURRENT_USER } from "./actions/types";
import setAuthToken from "./utils/setAuthToken";

import App from "./components/App";
import reducers from "./reducers";
import registerServiceWorker from "./registerServiceWorker";

const store = createStore(reducers, compose(applyMiddleware(reduxThunk)));

if (localStorage.jwtToken) {
	setAuthToken(localStorage.jwtToken);
	const decoded = jwt_decode(localStorage.jwtToken);
	store.dispatch({ type: SET_CURRENT_USER, payload: decoded });

	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		store.dispatch(logoutUser());
		window.location.href = "/signin";
	}
}

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root"),
);
registerServiceWorker();
