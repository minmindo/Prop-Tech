import React from "react";
import "./../../App.css";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { DialogContent, FormControl } from "@material-ui/core";

class SignUpPage extends React.Component {
  constructor() {
    super();
    this.state = {
      company_name: "",
      email: "",
      password: "",
      confirm_password: "",
      street_name: "",
      suite_number: "",
      city: "",
      state: "",
      zipcode: "",
      passwordError: "",
    };
    this.changeCompanyName = this.changeCompanyName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeConfirmPassword = this.changeConfirmPassword.bind(this);
    this.changeStreetName = this.changeStreetName.bind(this);
    this.changeSuiteNumber = this.changeSuiteNumber.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.changeState = this.changeState.bind(this);
    this.changeZipcode = this.changeZipcode.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  changeCompanyName(event) {
    this.setState({
      company_name: event.target.value,
    });
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

  changeConfirmPassword(event) {
    this.setState({
      confirm_password: event.target.value,
    });
  }

  changeStreetName(event) {
    this.setState({
      street_name: event.target.value,
    });
  }

  changeSuiteNumber(event) {
    this.setState({
      suite_number: event.target.value,
    });
  }

  changeCity(event) {
    this.setState({
      city: event.target.value,
    });
  }

  changeState(event) {
    this.setState({
      state: event.target.value,
    });
  }

  changeZipcode(event) {
    this.setState({
      zipcode: event.target.value,
    });
  }

  validate() {
    let passwordErrors = "";

    if (this.state.password != this.state.confirm_password) {
      passwordErrors = "Password must be the same";
      this.setState({ passwordError: passwordErrors });
      return false;
    }

    return true;
  }

  onSubmit(event) {
    event.preventDefault();

    if (this.validate()) {
      const registered = {
        company_name: this.state.company_name,
        email: this.state.email,
        password: this.state.password,
        street_name: this.state.street_name,
        suite_number: this.state.suite_number,
        city: this.state.city,
        state: this.state.state,
        zipcode: this.state.zipcode,
      };

      axios.post("/signup", registered).then((response) => {
        console.log(response.data);
        regprocess();
      });
    }
  }

  render() {
    const error = this.state.password !== this.state.confirm_password;
    return (
      <div>
        <div className="SignUpPage" id="signup">
          <header className="SignUp-header">
            <form onSubmit={this.onSubmit}>
              <Typography component="h1" variant="h4" color="primary">
                Please enter the information below
              </Typography>
              <div id="registration">
                <FormControl column>
                  <TextField autoFocus margin="dense" id="company_name" label="Company Name" type="text" onChange={this.changeCompanyName} value={this.state.company_name} required />

                  <TextField autoFocus margin="dense" id="email" label="Email" type="text" onChange={this.changeEmail} value={this.state.email} required />

                  <TextField autoFocus margin="dense" id="passowrd" label="Password" type="password" onChange={this.changePassword} value={this.state.password} required />

                  <TextField
                    autoFocus
                    margin="dense"
                    id="confirm_passowrd"
                    label="Confirm Password"
                    type="password"
                    onChange={this.changeConfirmPassword}
                    value={this.state.confirm_password}
                    helperText={this.validate ? this.state.passwordError : "Matched"}
                    error={error}
                    required
                  />

                  <TextField autoFocus margin="dense" id="street_name" label="Company Street Name" type="text" onChange={this.changeStreetName} value={this.state.street_name} required />

                  <TextField autoFocus margin="dense" id="suite_number" label="Suite Number" type="text" onChange={this.changeSuiteNumber} value={this.state.suite_number} />

                  <TextField autoFocus margin="dense" id="city" label="City" type="text" onChange={this.changeCity} value={this.state.city} required />

                  <TextField autoFocus margin="dense" id="state" label="State" type="text" onChange={this.changeState} value={this.state.state} required />

                  <TextField autoFocus margin="dense" id="zipcode" label="Zipcode" type="text" onChange={this.changeZipcode} value={this.state.zipcode} required />
                  <DialogContent />
                  <Button color="primary" type="submit" value="submit">
                    Register
                  </Button>
                </FormControl>
              </div>
            </form>
          </header>
        </div>
      </div>
    );
  }
}

function regprocess() {
  window.location = "/RegProcess";
}

export default SignUpPage;
