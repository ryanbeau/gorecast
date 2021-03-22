import React, { useEffect, useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
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

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      queryMe(`Bearer ${token}`)
        .then((result) => {
          if (result) {
            setMe(result);
          }
        })
        .catch((error) => {
          // TODO: do something with this
        });
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
            <NavLink to={`/profile/${account.accountName}`} exact className="nav-link">
              {account.accountName}
            </NavLink>
            <NavDropdown.Divider />
          </div>
        ))}
      </NavDropdown>
      <NavLink
        to="/external-api"
        exact
        className="nav-link"
        activeClassName="router-link-exact-active"
      >
        External API
      </NavLink>
    </div>
  );
};

export default MainNav;
