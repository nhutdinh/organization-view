import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import EmployeeOverview from "./pages/EmployeeOverview";
const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/overview" component={EmployeeOverview} />
        <Route exact path="/">
          <Redirect to="/overview" />
        </Route>
      </Switch>
    </Router>
  );
};
export default Routes;
