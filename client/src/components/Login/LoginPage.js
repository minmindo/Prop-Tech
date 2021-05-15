import React from "react";
import "./../../App.css";
import axios from "axios";
import { cognito, userPool } from "./../UserPool";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      errors: "",
    };

    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  changeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  changePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const loginDetails = {
      Username: this.state.email,
      Password: this.state.password,
    };
    const authenticationDetails = new cognito.AuthenticationDetails(loginDetails);
    const userDetails = {
      Username: this.state.email,
      Pool: userPool,
    };
    var cognitoUser = new cognito.CognitoUser(userDetails);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log(result);
        axios.post("/auth", { accessToken: result.accessToken.jwtToken, idToken: result.idToken.jwtToken }).then((response) => {
          console.log(response.data);
          let userType = response.data.accessData["cognito:groups"][0];
          if (userType == "PropertyManager") {
            sessionStorage.setItem("username", response.data.idData.email);
            sessionStorage.setItem("sub", response.data.accessData.sub);
            sessionStorage.setItem("accessToken", JSON.stringify(result.accessToken));
            sessionStorage.setItem("custom:company_name", result.idToken.payload["custom:company_name"]);
            sessionStorage.setItem("custom:street_name", result.idToken.payload["custom:street_name"]);
            sessionStorage.setItem("custom:suite_number", result.idToken.payload["custom:suite_number"]);
            sessionStorage.setItem("custom:city", result.idToken.payload["custom:city"]);
            sessionStorage.setItem("custom:state", result.idToken.payload["custom:state"]);
            sessionStorage.setItem("custom:zipcode", result.idToken.payload["custom:zipcode"]);
            propManaAfterSign();
          } else if (userType == "Admin") {
            sessionStorage.setItem("admin_username", response.data.idData.email);
            sessionStorage.setItem("admin_sub", response.data.accessData.sub);
            adminAfterSign();
          }
        });
        this.setState({
          errors: false,
        });
      },
      onFailure: (err) => {
        console.log(err);
        this.setState({
          errorMessage: err.message,
          errors: true,
        });
      },
    });
  }

  reset = () => {
    window.location = "/ResetPassword";
  };

  render() {
    var isError = this.state.errors;
    var message = this.state.errorMessage;
    return (
      <div>
        <div className="LoginPage">
          <form onSubmit={this.onSubmit}>
            <header className="Login-header">
              <Typography component="h1" variant="h1" color="primary">
                PropTech
              </Typography>
              <TextField autoFocus margin="dense" id="email" label="Enter your email" type="text" onChange={this.changeEmail} value={this.state.email} error={this.state.errors} required />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type="password"
                onChange={this.changePassword}
                value={this.state.password}
                helperText={isError ? message : null}
                error={this.state.errors}
                required
              />
              <Button color="primary" type="submit" value="submit">
                Login
              </Button>

              <Button color="primary" onClick={this.reset}>
                Reset Password
              </Button>
            </header>
          </form>
        </div>
      </div>
    );
  }
}

function adminAfterSign() {
  window.location = `/Admin/propertyManagers`;
}

function propManaAfterSign() {
  window.location = `/PropMana/${sessionStorage.getItem("sub")}/property`;
}

export default LoginPage;
