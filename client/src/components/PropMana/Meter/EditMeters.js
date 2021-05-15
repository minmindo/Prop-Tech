// TODO this is never used        delete???
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./../../../App.css";
import PropertyInfo from "./PropertyInfo.js";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";

class EditMeters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: this.props.name,
      property_id: this.props.property_id,
      address: this.props.address,
      meter_list: [],
      meter: this.props.meter,
      user_id: this.props.user_id,
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeMeter = this.changeMeter.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.property_id !== this.state.property_id) {
      this.setState({ name: this.props.name, property_id: this.props.property_id, address: this.props.address, meter: this.props.meter, user_id: this.props.user_id });
    }
  }

  updateMeter(property_id, meter) {
    {
      /*axios.patch('/property', {property_id: property_id, property_info: property_info}).then(response => {
            this.props.info.generateTableData();
        })*/
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

  changeMeter(event) {
    this.setState({
      meter: event.target.value,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      open: false,
    });
    var property_id = this.state.property_id;
    this.updateMeter(property_id, this.state.meter);
    console.log(this.state.meter);
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} color="primary">
          Edit
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Enter meter</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <TextField autoFocus margin="dense" id="meter" label="meter" type="text" value={this.state.meter} onChange={this.changeMeter} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default EditMeters;
