import React from "react";
import { connect } from "react-redux";
import uniqid from "uniqid";

import io from "socket.io-client";

import { addNewMessage, setMessages } from "../actions/chatActions";
import { updateUserList } from "../actions/userActions";

let socket;

const mapStateToProps = state => ({
	auth: state.auth,
	messages: state.message,
	activeUsers: state.activeUsers,
});

@connect(mapStateToProps, { addNewMessage, setMessages, updateUserList })
export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		socket = io("localhost:5000");

		socket.on("RECEIVE_MESSAGE", data => {
			this.props.addNewMessage(data);
		});

		socket.on("SET_MESSAGES", messages => {
			this.props.setMessages(messages);
		});
		socket.on("disconnect", () => {
			socket.emit("DELETE_USER_FROM_LIST", { user: this.props.auth.user.nickname });
		});

		socket.on("UPDATE_USER_LIST", userList => this.props.updateUserList(userList));
		window.onunload = () => {
			socket.emit("DELETE_USER_FROM_LIST", { user: this.props.auth.user.nickname });
		};
		this.state = {
			nickname: this.props.auth.user.nickname,
			message: "",
		};
	}

	componentDidMount() {
		console.log(this.props.auth.nickname);
		socket.emit("ADD_USER_TO_LIST", { user: this.props.auth.user.nickname });
		socket.emit("GET_MESSAGES");
		socket.emit("GET_USERS_LIST");
		this.scrollToBottom();
	}

	componentWillUnmount() {
		socket.emit("DELETE_USER_FROM_LIST", { user: this.props.auth.user.nickname });
		socket.disconnect();
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-sm-6">
						<div className="card">
							<div className="card-body">
								<div className="card-title">Chat</div>
								<hr />
								<div
									ref={el => {
										this.el = el;
									}}
									className="messages pre-scrollable">
									{this.renderMessages()}
								</div>
							</div>
							<div className="card-footer">
								<input
									type="text"
									placeholder="Message"
									name="message"
									className="form-control"
									value={this.state.message}
									onChange={this.onChange}
								/>
								<br />
								<button onClick={this.sendMessage} style={{ width: "200px" }} className="btn btn-primary">
									Send
								</button>
							</div>
						</div>
					</div>
					<div className="col-sm-6">
						<div className="card">
							<div className="card-body">
								<div className="card-title">Online</div>
								<hr />
								{this.renderUsersWhoOnline()}
							</div>
							<div className="card-footer">Currently Online: {this.props.activeUsers.length}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderMessages = () => {
		if (this.props.messages.length === 0) return "";
		return this.props.messages.map(message => {
			const time = new Date(message.date);
			return (
				<div key={message._id}>
					{message.nickname}: {message.message}
					<div className="float-right">{time.toLocaleString("ru-RU")}</div>
				</div>
			);
		});
	};

	renderUsersWhoOnline = () => {
		return this.props.activeUsers.map(user => {
			return <div key={uniqid()}>{user}</div>;
		});
	};

	scrollToBottom = () => {
		this.el.scrollIntoView({ behavior: "smooth" });
	};

	sendMessage = e => {
		e.preventDefault();
		this.setState({ message: "" });
		socket.emit("SEND_MESSAGE", {
			nickname: this.state.nickname,
			message: this.state.message,
		});
		this.scrollToBottom();
	};

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
}
