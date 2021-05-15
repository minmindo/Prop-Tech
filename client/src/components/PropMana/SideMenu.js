import React from "react";
import { Component } from "react";
import "./../../App.css";
import GenerateInvoice from "./../GenerateInvoice"; //TODO
import axios from "axios";

class SideMenu extends Component {
  manage_property = () => {
    if (this.props.is_admin === true) {
      window.location = `/Admin/PropMana/${this.props.sub}/property`;
    } else {
      window.location = `/PropMana/${this.props.sub}/property`;
    }
  };

  edit_profile = () => {
    if (this.props.is_admin === true) {
      window.location = `/Admin/PropMana/${this.props.sub}/user_info`;
    } else {
      window.location = `/PropMana/${this.props.sub}/user_info`;
    }
  };

  manage_utility = () => {
    if (this.props.is_admin === true) {
      window.location = `/Admin/PropMana/${this.props.sub}/property/${this.props.property_id}/utility_bill`;
    } else {
      window.location = `/PropMana/${this.props.sub}/property/${this.props.property_id}/utility_bill`;
    }
  };

  manage_invoice = () => {
    if (this.props.is_admin === true) {
      window.location = `/Admin/PropMana/${this.props.sub}/property/${this.props.property_id}/invoice_history`;
    } else {
      window.location = `/PropMana/${this.props.sub}/property/${this.props.property_id}/invoice_history`;
    }
  };
  view_detail = () => {
    if (this.props.is_admin === true) {
      window.location = `/Admin/PropMana/${this.props.sub}/property/${this.props.property_id}`;
    } else {
      window.location = `/PropMana/${this.props.sub}/property/${this.props.property_id}`;
    }
  };

  manage_users = () => {
    sessionStorage.removeItem("sub");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("property_id");
    sessionStorage.removeItem("property_name");
    sessionStorage.removeItem("total_footage");
    sessionStorage.removeItem("custom:company_name");
    window.location = "/Admin/propertyManagers";
  };

  log_out = () => {
    sessionStorage.removeItem("sub");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("property_id");
    sessionStorage.removeItem("property_name");
    sessionStorage.removeItem("total_footage");
    sessionStorage.removeItem("custom:state");
    sessionStorage.removeItem("custom:company_name");
    sessionStorage.removeItem("custom:city");
    sessionStorage.removeItem("custom:zipcode");
    sessionStorage.removeItem("custom:street_name");
    sessionStorage.removeItem("custom:suite_number");
    sessionStorage.removeItem("accessToken");
    axios.post("/logout").then((response) => {
      window.location = "/";
    });
  };

  render() {
    return (
      <div className="sidenav">
        <header>
          <ul>
            <a href="#" onClick={this.manage_property}>
              Manage Property Info
            </a>

            {this.props.is_admin ? null : (
              <a href="#" onClick={this.edit_profile}>
                Edit Profile Info
              </a>
            )}

            {this.props.display_more_options ? (
              <div>
                <a href="#" onClick={this.manage_utility}>
                  Manage Utility Bill
                </a>
                <a href="#" onClick={this.manage_invoice}>
                  Manage Invoice History
                </a>
                <GenerateInvoice property_id={this.props.property_id} />
                <a href="#" onClick={this.view_detail}>
                  Back to Property Details
                </a>
              </div>
            ) : null}

            {this.props.is_admin ? (
              <a href="#" onClick={this.manage_users}>
                Back to Admin Panel
              </a>
            ) : (
              <a href="#" onClick={this.log_out}>
                Log Out
              </a>
            )}
          </ul>
        </header>
      </div>
    );
  }
}

export default SideMenu;
