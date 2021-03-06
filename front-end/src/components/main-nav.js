import React, { useEffect, useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "../container/container";
const { queryMe } = require("../data");

// TODO: Why the hell does refreshing make the nav logo disappear? Has I ever??

const getInitialMe = () => {
  return {
    accounts: [],
  }
}

const MainNav = () => {
  const [me, setMe] = useState(getInitialMe());
  const { user, getAccessTokenSilently } = useAuth0();

  const addAccountText = 'Add Account';
  const onSubmit = (event) => {
    event.preventDefault(event);
    // TODO: event targets goes here
  }

  useEffect(() => {
    getAccessTokenSilently()
      .then((token) => {
        queryMe(`Bearer ${token}`)
          .then((result) => {
            if (result) {
              setMe(result);
            }
          })
          .catch((error) => {
            // TODO: do something with this
          });
      })
      .catch(ex => {
        // user is not logged in - no accounts to display
      });
  }, [user, getAccessTokenSilently]);

  return (
    <div className="navbar-nav mr-auto">
      <NavLink
        to="/"
        exact
        className="nav-link"
        activeClassName="router-link-exact-active"
      >
        Home
      </NavLink>
      <NavDropdown title="Accounts" className="nav-dropdown">
        {me.accounts.map((account, index) => (
          <div key={index}>
            <NavLink to={`/account/${account.accountName}`} exact className="nav-link">
              {account.accountName}
            </NavLink>
            <NavDropdown.Divider />
          </div>
        ))}
        <Container triggerText={addAccountText} onSubmit={onSubmit}/>
      </NavDropdown>
    </div>
  );
};

export default MainNav;
