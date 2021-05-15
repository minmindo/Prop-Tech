import React from "react";
import "./../../App.css";
import { cognito, userPool } from "./../UserPool";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import { Typography } from "@material-ui/core";

class ResetProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      verificationCode: "",
      newPassword1: "",
      newPassword2: "",
      dialog_open: false,
      dialog_text: "",
    };
  }
  changeVerificationCode = (event) => {
    this.setState({ verificationCode: event.target.value });
  };
  changeUsername = (event) => {
    this.setState({ username: event.target.value });
  };
  changeNewPassword1 = (event) => {
    this.setState({ newPassword1: event.target.value });
  };

  changeNewPassword2 = (event) => {
    this.setState({ newPassword2: event.target.value });
  };

  confirmPassword = () => {
    var cognitoUser = new cognito.CognitoUser({
      Username: this.state.username,
      Pool: userPool,
    });
    if (this.state.newPassword1 == this.state.newPassword2) {
      cognitoUser.confirmPassword(this.state.verificationCode, this.state.newPassword1, {
        onSuccess: function (result) {},
        onFailure: function (err) {},
      });
      this.setState({ dialog_open: true, dialog_text: "Success" });
    } else {
      this.setState({ dialog_open: true, dialog_text: "Passwords do not match" });
    }
  };

  handleDialogClose = () => {
    this.setState({ dialog_open: false });
    window.location = "/";
  };

  render() {
    return (
      <div className="ResetPassword">
        <header className="Login-header">
          <Typography component="h1" variant="h4" color="primary">
            New Password
          </Typography>
          <TextField autoFocus margin="dense" id="verification_code" label="Enter your verification code" value={this.state.verificationCode} onChange={this.changeVerificationCode} />
          <TextField autoFocus margin="dense" id="username" label="Enter your username" value={this.state.username} onChange={this.changeUsername} />
          <TextField autoFocus margin="dense" id="password1" type="password" label="Enter your new password" value={this.state.newPassword1} onChange={this.changeNewPassword1} />
          <TextField autoFocus margin="dense" id="password2" type="password" label="Re-enter your new password" value={this.state.newPassword2} onChange={this.changeNewPassword2} />
          <Button color="primary" onClick={this.confirmPassword}>
            Confirm
          </Button>
          <Dialog open={this.state.dialog_open} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
            <DialogContent>
              <DialogContentText></DialogContentText>
              {this.state.dialog_text}
              <Button onClick={this.handleDialogClose} color="primary">
                OK
              </Button>
            </DialogContent>
          </Dialog>
        </header>
      </div>
    );
  }
}

export default ResetProcess;
