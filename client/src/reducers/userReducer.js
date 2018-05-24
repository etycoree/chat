import { UPDATE_USER_LIST } from "../actions/types";

const initialState = [];

export default (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_USER_LIST:
			return action.payload;

		default:
			return state;
	}
};
