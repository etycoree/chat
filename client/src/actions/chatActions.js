import { NEW_MESSAGE, SET_MESSAGES } from "./types";

export const setMessages = data => dispatch =>
	dispatch({
		type: SET_MESSAGES,
		payload: data,
	});

export const addNewMessage = data => dispatch =>
	dispatch({
		type: NEW_MESSAGE,
		payload: data,
	});
