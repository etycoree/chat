import { UPDATE_USER_LIST } from "./types";
export const updateUserList = data => dispatch =>
	dispatch({
		type: UPDATE_USER_LIST,
		payload: data,
	});
