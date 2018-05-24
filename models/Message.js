import mongoose from "mongoose";

const { Schema } = mongoose;

const MessageSchema = new Schema({
	nickname: {
		type: String,
	},
	message: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

export default mongoose.model("messages", MessageSchema);
