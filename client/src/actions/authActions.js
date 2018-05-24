import axios from "axios";
import jwt_decode from "jwt-decode";

import setAuthToken from "../utils/setAuthToken";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

export const registerUser = (userData, history) => async dispatch => {
	try {
		await axios.post("/auth/signup", userData);
		history.push("/signin");
	} catch (err) {
		console.log(err);
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data,
		});
	}
};

export const loginUser = (userData, history) => async dispatch => {
	try {
		const res = await axios.post("/auth/signin", userData);
		const { token } = res.data;
		localStorage.setItem("jwtToken", token);
		setAuthToken(token);
		const decoded = jwt_decode(token);
		dispatch({
			type: SET_CURRENT_USER,
			payload: decoded,
		});
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data,
		});
	}
};

export const logoutUser = (userData, history) => async dispatch => {
	localStorage.removeItem("jwtToken");
	setAuthToken(false);
	dispatch({
		type: SET_CURRENT_USER,
		payload: {},
	});
};
