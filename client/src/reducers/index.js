import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userReducer from "./userReducer";
import chatReducer from "./chatReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
	auth: authReducer,
	activeUsers: userReducer,
	message: chatReducer,
	errors: errorReducer,
});
