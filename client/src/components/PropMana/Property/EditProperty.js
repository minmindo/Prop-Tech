import React from "react";
import "./../../../App.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NumberFormat from 'react-number-format';
import axios from "axios";

class EditProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      property_id: this.props.property_id,
      name: this.props.name,
      address: this.props.address,
      total_footage: this.props.total_footage,
      landlord_phone: this.props.landlord_phone,
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.changeTotalFootage = this.changeTotalFootage.bind(this);
    this.changeLandlordPhone = this.changeLandlordPhone.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.property_id !== this.state.property_id) {
      this.setState({
        property_id: this.props.property_id,
        name: this.props.name,
        address: this.props.address,
        total_footage: this.props.total_footage,
        landlord_phone: this.props.landlord_phone,
        nameError: "",
        addressError: "",
        footageError: "",
        phoneError: "",
        name_errors: false,
        address_errors: false,
        footage_errors: false,
        phone_errors: false,
      });
      this.validation = this.validation.bind(this)
    }
  }

  updatePropertyInfo(property_info) {
    axios.patch("/property", { sub: this.props.sub, property_info: property_info }).then((response) => {
      this.props.generateTableData();
    });
  }

  handleClickOpen() {
    this.setState({
      open: true,
    });
  }

  handleClose() {
    this.setState({
      open: false,
      nameError: "",
      addressError: "",
      footageError: "",
      phoneError: "",
      name_errors: false,
      address_errors: false,
      footage_errors: false,
      phone_errors: false,
    });
  }

  changeName(event) {
    this.setState({
      name: event.target.value,
      nameError: "",
      name_errors: false
    });
  }

  changeAddress(event) {
    this.setState({
      address: event.target.value,
      addressError: "",
      address_errors: false
    });
  }

  changeTotalFootage(event) {
    this.setState({
      total_footage: event.target.value,
      footageError: "",
      footage_errors: false
    });
  }

  changeLandlordPhone(event) {
    this.setState({
      landlord_phone: event.target.value,
      phoneError: "",
      phone_errors: false
    });
  }

  validation() {
    var isValidate = true;
    if (this.state.name === "") {
      var nameMessage = "Please enter a valid property name"
      this.setState({
        nameError: nameMessage,
        name_errors: true
      })
      isValidate = false;
    }
    if (this.state.address === "") {
      var addressMessage = "Please enter a valid property address"
      this.setState({
        addressError: addressMessage,
        address_errors: true
      })
      isValidate = false;
    }
    if (this.state.total_footage === "" || this.state.total_footage < 1 || !this.state.total_footage) {
      var footageMessage = "Please enter a valid total footage"
      this.setState({
        footageError: footageMessage,
        footage_errors: true
      })
      isValidate = false;
    }
    var phone_pattern = new RegExp(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/);
    if (this.state.landlord_phone === "" || !phone_pattern.test(this.state.landlord_phone)) {
      var phoneMessage = "Please enter a valid phone number"
      this.setState({
        phoneError: phoneMessage,
        phone_errors: true
      })
      isValidate = false;
    }
    return isValidate;
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.validation()) {
      this.setState({
        open: false,
        nameError: "",
        addressError: "",
        footageError: "",
        phoneError: "",
        name_errors: false,
        address_errors: false,
        footage_errors: false,
        phone_errors: false,
      });
      var property_info = {
        property_id: this.state.property_id,
        name: this.state.name,
        address: this.state.address,
        total_footage: this.state.total_footage,
        landlord_phone: this.state.landlord_phone,
      };
      this.updatePropertyInfo(property_info);
    }
  }

  render() {
    var is_validate_name = this.state.name_errors;
    var is_validate_address = this.state.address_errors;
    var is_validate_footage = this.state.footage_errors;
    var is_validate_phone = this.state.phone_errors;
    var name_message = this.state.nameError;
    var address_message = this.state.addressError;
    var footage_message = this.state.footageError;
    var phone_message = this.state.phoneError;
    return (
      <div>
        <Button color="primary" onClick={this.handleClickOpen}>
          Edit
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit Property Info</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <TextField 
              autoFocus 
              margin="dense" 
              id="name" 
              label="Property Name" 
              type="text" 
              value={this.state.name} 
              onChange={this.changeName}
              helperText={is_validate_name ? name_message : null}
              error={this.state.name_errors} 
              fullWidth 
            />
            <TextField 
              autoFocus 
              margin="dense" 
              id="address" 
              label="Property Address" 
              type="text" 
              value={this.state.address} 
              onChange={this.changeAddress} 
              helperText={is_validate_address ? address_message : null}
              error={this.state.address_errors}
              fullWidth 
            />
            <TextField 
              autoFocus 
              margin="dense" 
              id="total_footage" 
              label="Total Footage" 
              type="text" 
              value={this.state.total_footage} 
              onChange={this.changeTotalFootage} 
              helperText={is_validate_footage ? footage_message : null}
              error={this.state.footage_errors}
              fullWidth 
            />
            <NumberFormat 
              customInput={TextField}
              autoFocus 
              margin="dense" 
              id="landlord_phone" 
              label="Landlord Phone Number" 
              type="text" 
              value={this.state.landlord_phone} 
              onChange={this.changeLandlordPhone} 
              helperText={is_validate_phone ? phone_message : null}
              error={this.state.phone_errors}
              fullWidth 
              format="(###) ###-####" 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
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

export default EditProperty;
