import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  Security,
  ImplicitCallback,
  withAuth
} from "@okta/okta-react";

import ViewBlog from "./pages/ViewBlog";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import Navbar from "react-bootstrap/Navbar";
import ListBlog from "./pages/ListBlog";
import { AuthContextProvider } from "./utils/AuthContext";

function AuthAwareApp(props) {
  const config = {
    issuer: "https://dev-<insert-id-here>.okta.com/oauth2/default",
    redirectUri: window.location.origin + "/implicit/callback",
    clientId: "<insert-client-id-here>",
    pkce: true //,
    //scopes: ['openid', 'email', 'profile', 'groups']
    // scopes: 'openid profile email groups'
  };
  const AuthApp = withAuth(App);

  return (
    <Router>
      <Security {...config}>
        <AuthApp {...props} />
      </Security>
    </Router>
  );
}

function App({ auth }) {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthenticated());
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <div className="container">
          <Link className="btn btn-primary" to="/">
            {" "}
            Home
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {user && (
              <Navbar.Text>
                <span>{user}</span>{" "}
                <button className="btn btn-link btnAlign" onClick={logout}>
                  Logout
                </button>
              </Navbar.Text>
            )}
            {!user && (
              <Navbar.Text>
                <span>Welcome Guest!</span>{" "}
                <button className="btn btn-link btnAlign" onClick={login}>
                  Login
                </button>
              </Navbar.Text>
            )}
          </Navbar.Collapse>
        </div>
      </Navbar>

      <div className="container mt-1">
        <AuthContextProvider value={auth}>
          <Route path="/" exact={true} component={ListBlog} />
          <Route path="/view/:id" exact={true} component={ViewBlog} />
          <Route path="/create" exact={true} component={CreateBlog} />
          <Route path="/edit/:id" exact={true} component={EditBlog} />
          <Route path="/implicit/callback" component={ImplicitCallback} />
        </AuthContextProvider>
      </div>
    </>
  );

  async function checkAuthenticated() {
    const isAuth = await auth.isAuthenticated();
    if (isAuth !== isAuthenticated) {
      setIsAuthenticated(isAuth);
      if (isAuth) {
        const user = await auth.getUser();
        setUser(`${user.given_name} ${user.family_name}`);
      }
    }
  }

  async function login() {
    // Redirect to '/' after login
    auth.login("/");
  }

  async function logout() {
    // Redirect to '/' after logout
    auth.logout("/");
    setIsAuthenticated(false);
  }
}

export default AuthAwareApp;
