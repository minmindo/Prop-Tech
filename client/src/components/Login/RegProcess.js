import { Typography } from "@material-ui/core";
import React from "react";
import "./../../App.css";
import Button from "@material-ui/core/Button";

class RegProcess extends React.Component {
  render() {
    return (
      <div>
        <div className="RegProcess">
          <header className="RegProcess-header">
            <Typography component="h1" variant="h5" color="primary">
              Thank you, you will recieve an email about your registration result shortly.
            </Typography>

            <Button color="primary" onClick={back}>
              Ok
            </Button>
          </header>
        </div>
      </div>
    );
  }
}

function back() {
  window.location = "/";
}

export default RegProcess;
