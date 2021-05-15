import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { DialogContent } from "@material-ui/core";

class HomePage extends React.Component {
  login = () => {
    window.location = "/LoginPage";
  };
  signup = () => {
    window.location = "/SignUpPage";
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Paper elevation={24}>
            <Typography component="h1" variant="h1" color="primary">
              PropTech
            </Typography>
            <DialogContent />
            <Divider />
            <Divider />
            <Divider />
            <DialogContent />
            <DialogContent />
            <div className="buttons">
              <table>
                <thead>
                  <tr>
                    <th>
                      <Paper>
                        <Button color="primary" style={{ fontSize: 15 }} className="button" onClick={this.login}>
                          Login
                        </Button>
                      </Paper>
                    </th>
                    <th>
                      <Paper>
                        <Button color="primary" style={{ fontSize: 15 }} className="button" onClick={this.signup}>
                          Sign Up
                        </Button>
                      </Paper>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          </Paper>
        </header>
      </div>
    );
  }
}

export default HomePage;
