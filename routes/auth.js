import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import validateSignUp from "../validation/validateSignUp";
import validateSignIn from "../validation/validateSignIn";

const router = express.Router();

router.post("/signup", async (req, res) => {
	const { isValid, errors } = validateSignUp(req.body);

	if (!isValid) return res.status(400).json(errors);

	const { email, nickname, password } = req.body;

	console.log(email, nickname, password);

	try {
		const isUserExist = await User.findOne({ email });

		if (isUserExist) {
			errors.email = "User with this email already exist";
			return res.status(400).json(errors);
		}

		const hash = await bcrypt.hash(password, 10);

		const user = new User({ email, nickname, password: hash });
		await user.save();
		res.json(user);
	} catch (err) {
		res.status(400).json({});
		console.log(err);
	}
});

router.post("/signin", async (req, res) => {
	try {
		const { errors, isValid } = validateSignIn(req.body);
		if (!isValid) return res.status(400).json(errors);
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		const isMatch = await bcrypt.compare(password, user.password);;
		if (!user || !isMatch) {
			errors.login = "Email or password incorrect";
			return res.status(400).json(errors);
		}

		const payload = { email: user.email, nickname: user.nickname };

		jwt.sign(payload, "secret", { expiresIn: 3600 * 24 }, (err, token) => {
			res.json({ success: true, token: "Bearer " + token });
		});
	} catch (err) {
		res.status(400).json({login: "Email or password incorrect"});
		console.log(err);
	}
});

export default router;
