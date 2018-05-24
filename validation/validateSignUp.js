import Validator from "validator";
import isEmpty from "lodash/isEmpty";

export default data => {
	let errors = {};
	data.email = !isEmpty(data.email) ? data.email : "";
	data.nickname = !isEmpty(data.nickname) ? data.nickname : "";
	data.password = !isEmpty(data.password) ? data.password : "";

	if (!Validator.isEmail(data.email)) {
		errors.email = "Please fill correct email";
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = "Email is required";
	}

	if (Validator.isEmpty(data.nickname)) {
		errors.email = "Nickname is required";
	}

	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = "Password must be at least 6 characters";
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = "Password is required";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};
