import React from "react";
import "./../../../App.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class EditSubmeters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tenant_id: this.props.tenant_id,
      submeter_list: [],
      submeter_id: this.props.submeter_id,
      meter_id: this.props.meter_id,
      submeter_error: false,
      error_message: ""
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeSubmeter = this.changeSubmeter.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidUpdate() {
    if (this.props.tenant_id !== this.state.tenant_id) {
      this.setState({
        tenant_id: this.props.tenant_id,
        submeter_list: [],
        submeter_id: this.props.submeter_id,
        meter_id: this.props.meter_id,
      });
    }
  }
  updateSubmeter(tenant_id, submeter) {
    {
      //TODO
      /*axios.patch('/tenant', {sub: this.props.sub, tenant_id: tenant_id, tenant_info: tenant_info}).then(response => {
            this.props.generateTableData();
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

  changeSubmeter(event) {
    this.setState({
      submeter_id: event.target.value,
      submeter_error: false,
      error_message: ""
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      open: false,
    });
    this.updateSubmeter(this.state.tenant_id, this.state.submeter_id);
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} color="primary">
          Edit
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Enter Submeter</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <TextField autoFocus margin="dense" id="submeter" label="Submeter" type="text" value={this.state.submeter_id} onChange={this.changeSubmeter} fullWidth />
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

export default EditSubmeters;
