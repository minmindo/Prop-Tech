import React from "react";
import { Component } from "react";
import "./../../App.css";
import axios from "axios";

class AdminSideMenu extends Component {
  constructor(props) {
    super(props);
  }

  manage_users = () => {
    window.location = "/Admin/propertyManagers";
  };

  log_out = () => {
    sessionStorage.removeItem("admin_username");
    sessionStorage.removeItem("admin_sub");
    axios.post("/logout").then((response) => {
      window.location = "/";
    });
  };

  render() {
    return (
      <div className="sidenav">
        <header>
          <ul>
            <a href="#" onClick={this.manage_users}>
              Manage Users
            </a>
            <a href="#" onClick={this.log_out}>
              Log Out
            </a>
          </ul>
        </header>
      </div>
    );
  }
}

export default AdminSideMenu;
