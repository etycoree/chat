import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { withRouter } from "react-router-dom";

import { registerUser } from "../actions/authActions.js";

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

@connect(mapStateToProps, { registerUser })
@withRouter
export default class SignUp extends React.Component {
	state = {
		email: "",
		nickname: "",
		password: "",
		errors: {},
	};

	static propTypes = {
		registerUser: PropTypes.func.isRequired,
		auth: PropTypes.object.isRequired,
		errors: PropTypes.object.isRequired,
	};

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push("/");
		}
	}

	static getDerivedStateFromProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			nextProps.history.push("/");
		}
		if (nextProps.errors) {
			return {
				errors: nextProps.errors,
			};
		}
	}

	render() {
		const { errors } = this.state;
		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display4 text-center">Sign Up</h1>
							<form onSubmit={this.onSubmit}>
								<div className="form-group">
									<input
										type="text"
										name="email"
										value={this.state.email}
										placeholder="Email"
										onChange={this.onChange}
										className={classnames("form-control form-control-lg", {
											"is-invalid": errors.email,
										})}
									/>
									{errors.email && <div className="invalid-feedback">{errors.email}</div>}
								</div>
								<div className="form-group">
									<input
										type="text"
										name="nickname"
										value={this.state.nickname}
										placeholder="Nickname"
										onChange={this.onChange}
										className={classnames("form-control form-control-lg", {
											"is-invalid": errors.nickname,
										})}
									/>
									{errors.nickname && <div className="invalid-feedback">{errors.nickname}</div>}
								</div>
								<div className="form-group">
									<input
										type="password"
										name="password"
										value={this.state.password}
										placeholder="Password"
										onChange={this.onChange}
										className={classnames("form-control form-control-lg", {
											"is-invalid": errors.password,
										})}
									/>
									{errors.password && <div className="invalid-feedback">{errors.password}</div>}
								</div>
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}

	onSubmit = e => {
		e.preventDefault();
		const user = this.state;
		delete user.errors;
		this.props.registerUser(user, this.props.history);
	};

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
}
