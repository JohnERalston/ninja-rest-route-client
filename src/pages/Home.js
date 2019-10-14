// src/Home.js

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withAuth } from '@okta/okta-react';

export default withAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.printStuff = this.printStuff.bind(this);
    this.doAjax = this.doAjax.bind(this);
    this.checkAuthentication();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  async doAjax() {
    const response = await fetch('https://dev-265635.okta.com/oauth2/default/v1/api/v1/users/jralston@renttherunway.com/groups', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + await this.props.auth.getAccessToken()
      }
    });
  }
  //https://github.com/axios/axios
  //https://developer.okta.com/docs/reference/api/users/#get-user-s-groups


  async login() {
    // Redirect to '/' after login
    this.props.auth.login('/');
  }

  async logout() {
    // Redirect to '/' after logout
    this.props.auth.logout('/');
  }

  async printStuff() {
    const user = await this.props.auth.getUser();
    console.log(user);
    const accessToken = await this.props.auth.getAccessToken();
    console.log(accessToken);
  }

  render() {
    if (this.state.authenticated === null) return null;

    const button = this.state.authenticated ?
      <button onClick={this.logout}>Logout</button> :
      <button onClick={this.login}>Login</button>;

      this.printStuff();
    return(
      <div>
        { button }
        <Link to={"/protected"} >protected</Link>
      </div>
    )
  }
});

///https://dev-265635.okta.com/oauth2/default/v1/api/v1/users/jralston@renttherunway.com/groups