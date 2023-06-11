import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useWeb3 from "../hooks/useWeb3";
import logo from "../assets/logo.png";

const NavigationBar = () => {
  const { connect, connected, address, showAccount } = useWeb3();

  const getFormattedAccount = (account) => {
    return account
      .slice(0, 5)
      .concat("...")
      .concat(account.slice(account.length - 4));
  };

  return (
    <Navbar
      expand="md"
      bg="dark"
      variant="dark"
      className="justify-content-between p-3"
    >
      <Navbar.Brand>
        <NavLink to="/" className="navbar-brand">
          <img className="logo" src={logo} alt="EVOTE" />
        </NavLink>
      </Navbar.Brand>
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Item>
            <NavLink to="/register" className="link nav-link">
              Register
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/vote" className="link nav-link">
              Vote
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/results" className="link nav-link">
              Results
            </NavLink>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
      {connected ? (
        <button
          className="btn btn-outline-light"
          onClick={showAccount}
        >
          {getFormattedAccount(address)}
        </button>
      ) : (
        <button className="btn btn-outline-light" onClick={connect}>
          Connect
        </button>
      )}
      <Navbar.Toggle aria-controls="navbar-nav" />
    </Navbar>
  );
};

export default NavigationBar;
