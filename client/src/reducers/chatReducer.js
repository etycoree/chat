import { NEW_MESSAGE, SET_MESSAGES, SET_USERS } from "../actions/types";

const initialState = [];

export default (state = initialState, action) => {
	switch (action.type) {
		case NEW_MESSAGE:
			return [...state, action.payload];

		case SET_MESSAGES:
			return action.payload;

		default:
			return state;
	}
};
