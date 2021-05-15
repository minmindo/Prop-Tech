import React from "react";
import "./App.css";
import HomePage from "./components/Login/HomePage.js";
import RegProcess from "./components/Login/RegProcess.js";
import ResetProcess from "./components/Login/ResetProcess.js";
import LoginPage from "./components/Login/LoginPage.js";
import SignUpPage from "./components/Login/SignUpPage.js";
import ResetPassword from "./components/Login/ResetPassword.js";
import Navigation from "./components/NavigationBar/Navigation.js";
import Abouts from "./components/NavigationBar/About.js";
import AdminAfterSign from "./components/Admin/AdminAfterSign.js";
import PropManaAfterSign from "./components/PropMana/PropManaAfterSign.js";
import IndividualTenantInvoice from "./components/IndividualTenantInvoice.js";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import config from "./config.json";
// For local testing and development
// axios.defaults.baseURL = "http://localhost:3000";

// For build
axios.defaults.baseURL = `http://${config.server_ip}:3000/`;
axios.defaults.withCredentials = true;
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/LoginPage" component={LoginPage} />
          <Route exact path="/SignUpPage" component={SignUpPage} />
          <Route exact path="/About" component={Abouts} />
          <Route exact path="/Admin" component={AdminAfterSign} />
          <Route exact path="/Admin/propertyManagers" component={AdminAfterSign} />
          <Route exact path="/PropMana" component={PropManaAfterSign} />
          <Route exact path="/PropMana/:sub" component={PropManaAfterSign} />
          <Route exact path="/PropMana/:sub/property" component={PropManaAfterSign} />
          <Route exact path="/PropMana/:sub/property/:property_id" component={PropManaAfterSign} />
          <Route exact path="/PropMana/:sub/property/:property_id/invoice_history" component={PropManaAfterSign} />
          <Route exact path="/PropMana/:sub/property/:property_id/utility_bill" component={PropManaAfterSign} />
          <Route exact path="/PropMana/:sub/user_info" component={PropManaAfterSign} />
          <Route exact path="/PropMana/:sub/property/:propertyId/individual_tenant_invoice" component={IndividualTenantInvoice} />
          <Route exact path="/Admin/PropMana/:sub" component={PropManaAfterSign} />
          <Route exact path="/Admin/PropMana/:sub/property" component={PropManaAfterSign} />
          <Route exact path="/Admin/PropMana/:sub/property/:property_id" component={PropManaAfterSign} />
          <Route exact path="/Admin/PropMana/:sub/invoiceHistory" component={PropManaAfterSign} />
          <Route exact path="/Admin/PropMana/:sub/property/:property_id/invoice_history" component={PropManaAfterSign} />
          <Route exact path="/Admin/PropMana/:sub/property/:property_id/utility_bill" component={PropManaAfterSign} />
          <Route exact path="/Admin/PropMana/:sub/user_info" component={PropManaAfterSign} /> {/*  TODO unused */}
          <Route exact path="/Admin/PropMana/:sub/property/:propertyId/individual_tenant_invoice" component={IndividualTenantInvoice} />
          <Route exact path="/RegProcess" component={RegProcess} />
          <Route exact path="/ResetPassword" component={ResetPassword} />
          <Route exact path="/ResetProcess" component={ResetProcess} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
