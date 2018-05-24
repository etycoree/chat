import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
	email: {
		type: String,
	},
	nickname: {
		type: String,
	},
	password: {
		type: String,
	},
});

export default mongoose.model("users", UserSchema);
