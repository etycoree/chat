import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import PrivateRoute from "../utils/PrivateRoute";
import Chat from "./Chat";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Header from "./Header";

@connect()
export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Router>
          <div>
            <Header />
            <Switch>
              <PrivateRoute exact path="/" component={Chat} />
            </Switch>
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
          </div>
        </Router>
      </div>
    );
  }
}
