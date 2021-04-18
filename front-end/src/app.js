import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { NavBar, Footer, Loading } from "./components";
import { Home, Account, Budget, Category } from "./views";
import ProtectedRoute from "./auth/protected-route";

import "./app.css";

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div id="app" className="d-flex flex-column h-100">
      <NavBar />
      <div className="container flex-grow-1">
        <Switch>
          <Route path="/" exact component={Home} />
          <ProtectedRoute path="/account/:account" component={Account} />
          <ProtectedRoute path="/budget/:budgetId" component={Budget} />
          <ProtectedRoute path="/category/:category" component={Category} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};

export default App;
