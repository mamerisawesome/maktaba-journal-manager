import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//Routes
import NotFound from "components/shared/NotFound";
import App from "../App";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
