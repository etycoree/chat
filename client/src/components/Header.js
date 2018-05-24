import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { logoutUser } from "../actions/authActions";

const mapStateToProps = state => ({
	auth: state.auth,
});

@connect(mapStateToProps, { logoutUser })
export default class Header extends React.Component {
	static propTypes = {
		logoutUser: PropTypes.func.isRequired,
		auth: PropTypes.object.isRequired,
	};

	render() {
		const { isAuthenticated, user } = this.props.auth;

		const authLinks = (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<a href="/" className="nav-link">
						{user.nickname}
						{"  "}
					</a>
				</li>
				<li className="nav-item">
					<a href="/" onClick={this.onLogoutClick} className="nav-link">
						Logout
					</a>
				</li>
			</ul>
		);

		const guestLinks = (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<Link className="nav-link" to="/signup">
						Sign Up
					</Link>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/signin">
						Login
					</Link>
				</li>
			</ul>
		);

		return (
			<nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
				<div className="container">
					<Link className="navbar-brand" to="/">
						Chat
					</Link>

					<div className="collapse navbar-collapse" id="mobile-nav">
						{isAuthenticated ? authLinks : guestLinks}
					</div>
				</div>
			</nav>
		);
	}

	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
	};
}
