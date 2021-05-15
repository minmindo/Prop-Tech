import React from "react";
import "./../../../App.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";

class DeleteSubmeters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.deleteSubmeter = this.deleteSubmeter.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  deleteSubmeter() {
    {
      axios.delete("/delete_submeter", { data: { sub: this.props.sub, tenant_id: this.props.tenant_id, submeter_id: this.props.submeter_id } }).then((response) => {
        this.props.generateTableData();
      });
    }
  }

  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  onSubmit() {
    this.setState({
      open: false,
    });
    this.deleteSubmeter();
  }
  render() {
    return (
      <div>
        <Button color="secondary" onClick={this.handleClickOpen}>
          Delete
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Delete Submeter"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Are you sure you want to delete this submeter?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Back
            </Button>
            <Button onClick={this.onSubmit} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteSubmeters;
