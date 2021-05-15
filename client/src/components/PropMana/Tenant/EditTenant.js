import React from "react";
import "./../../../App.css";
import WhatIsProRataShare from "./../../WhatIsProRataShare.js";
import MeterCheckBox from "./../../MeterCheckbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import NumberFormat from 'react-number-format';
import axios from "axios";
import { is } from "date-fns/locale";
import { Typography } from "@material-ui/core";

class EditTenant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      meter_list: [],
      cur_meter_list: [],
      tenant_id: this.props.tenant_id,
      name: this.props.name,
      email: this.props.email,
      address: this.props.address,
      landlord_phone: this.props.landlord_phone,
      rubs: this.props.rubs,
      property_id: this.props.property_id,
      yes: false,
      no: false,
      yesprorata: false,
      noprorata: false,
      tenantFt: "",
      nameError: "",
      addressError: "",
      emailError: "",
      phoneError: "",
      name_errors: false,
      address_errors: false,
      email_errors: false,
      phone_errors: false,
      choice_errors: false,
      helper_text: "",
      rubs_errors: false,
      rubs_helper_text: "",
      percent_errors: false,
      percent_helper_text: "",
      meter_errors: false,
      meter_helper_text: "",
      is_meter_tenant: this.props.is_meter_tenant,
      is_submeter_tenant: this.props.is_submeter_tenant,
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.changeLandlordPhone = this.changeLandlordPhone.bind(this);
    this.changeRubs = this.changeRubs.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validation = this.validation.bind(this);
    this.changeRUBS = this.changeRUBS.bind(this);
    this.getAssociatedMeter = this.getAssociatedMeter.bind(this);
    this.onChangeYes = this.onChangeYes.bind(this);
    this.onChangeNo = this.onChangeNo.bind(this);
    this.changeTenantFt = this.changeTenantFt.bind(this);
    this.onChangeYesProrata = this.onChangeYesProrata.bind(this);
    this.onChangeNoProrata = this.onChangeNoProrata.bind(this);
    this.calculate = this.calculate.bind(this);
    this.getMeterList = this.getMeterList.bind(this);
  }
  componentDidUpdate() {
    if (this.props.tenant_id !== this.state.tenant_id) {
      this.setState({
        tenant_id: this.props.tenant_id,
        name: this.props.name,
        email: this.props.email,
        address: this.props.address,
        landlord_phone: this.props.landlord_phone,
        rubs: this.props.rubs,
        property_id: this.props.property_id,
        yes: this.props.yes,
        no: this.props.no,
        yesprorata: this.props.yesprorata,
        noprorata: this.props.noprorata,
        tenantFt: this.props.tenantFt,
      });
    }
  }
  updateTenantInfo(tenant_id, tenant_info) {
    console.log("meterlistttttt" + this.state.meter_list)
    axios.patch("/tenant", { sub: this.props.sub, tenant_id: tenant_id, tenant_info: tenant_info, meter_list: this.state.meter_list }).then((response) => {
      this.props.generateTableData();
    });
  }

  handleClickOpen() {
    var cur = [];
    this.getMeterList().then(() => {
      let tableData = this.state.meter_list;
      // console.log("table", tableData);
      for (var i = 0; i < tableData.length; i++) {
        cur.push(tableData[i]);
      }
      this.cur = cur;
      this.forceUpdate();
      // console.log("meterlist: " + this.cur)
    });
    if (this.state.rubs === 0) {
      this.setState({
        yesprorata: false,
        noprorata: true,
      })
    } else {
      this.setState({
        yesprorata: true,
        noprorata: false,
        yes: true,
      })
    }
    this.setState({
      open: true,
      cur_meter_list: this.cur
    });
  }

  handleClose() {
    this.setState({
      open: false,
      nameError: "",
      addressError: "",
      emailError: "",
      phoneError: "",
      name_errors: false,
      address_errors: false,
      email_errors: false,
      phone_errors: false,
      meter_errors: false,
      meter_helper_text: "",
    });
  }

  changeName(event) {
    this.setState({
      name: event.target.value,
      nameError: "",
      name_errors: false
    });
  }

  changeEmail(event) {
    this.setState({
      email: event.target.value,
      emailError: "",
      email_errors: false
    });
  }

  changeAddress(event) {
    this.setState({
      address: event.target.value,
      addressError: "",
      address_errors: false
    });
  }

  changeLandlordPhone(event) {
    this.setState({
      landlord_phone: event.target.value,
      phoneError: "",
      phone_errors: false
    });
  }

  changeRubs(event) {
    this.setState({
      rubs: event.target.value,
    });
  }

  changeRUBS(event) {
    event.preventDefault();
    var value = parseFloat(event.target.value) / 100
    console.log("rubs is " + value)
    this.setState({
      rubs: value,
      percent_errors: false,
      percent_helper_text: ""
    });
  }

  changeTenantFt(event) {
    event.preventDefault();
    var totalBuildingFt = this.props.total_footage;
    var tenantft = event.target.value;
    if (tenantft != "") {
      var rubs = tenantft / totalBuildingFt;
      this.setState({
        rubs: rubs,
      });
    }
    this.setState({
      tenantFt: event.target.value,
      percent_errors: false,
      percent_helper_text: ""
    });
  }

  calculate(event) {
    var totalBuildingFt = this.props.total_footage;
    var tenantft = this.state.tenantFt;
    if (tenantft != "") {
      var rubs = tenantft / totalBuildingFt;
      this.setState({
        rubs: rubs,
      });
      this.forceUpdate();
      /* should specify a way to calculate rubs based on tenantFt and then save into rubs variable*/
      console.log(tenantft / totalBuildingFt);
    }
    event.preventDefault();
  }

  getAssociatedMeter(new_meter) {
    var temp_list = this.state.meter_list;
    var remove = false;
    for (var i = 0; i < temp_list.length; i++) {
      if (temp_list[i] === new_meter) {
        temp_list.splice(i, 1);
        remove = true;
      }
    }
    if (remove) {
      this.setState({
        meter_list: temp_list
      })
    } else {
      this.setState((prevState) => ({
        meter_list: [new_meter, ...prevState.meter_list],
      }));
    }
  }

  onChangeYes(event) {
    event.preventDefault();
    this.setState({
      yes: event.target.checked,
      no: false,
      rubs_errors: false,
      rubs_helper_text: "",
    });
  }

  onChangeNo(event) {
    event.preventDefault();
    this.setState({
      no: event.target.checked,
      yes: false,
      rubs_errors: false,
      rubs_helper_text: "",
    });
  }

  onChangeYesProrata(event) {
    event.preventDefault();
    this.setState({
      yesprorata: event.target.checked,
      noprorata: false,
      choice_errors: false,
      helper_text: ""
    })
  }

  onChangeNoProrata(event) {
    event.preventDefault();
    this.setState({
      noprorata: event.target.checked,
      yesprorata: false,
      choice_errors: false,
      helper_text: ""
    })
  }

  validation() {
    var isValidate = true;
    var email_pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    var name_pattern = new RegExp(/^[a-z ,.'-]+$/i);
    if (this.state.name === "" || !name_pattern.test(this.state.name)) {
      var nameMessage = "Please enter a valid name"
      this.setState({
        nameError: nameMessage,
        name_errors: true
      })
      isValidate = false;
    }
    if (this.state.email === "") {
      var emailMessage = "Please enter a valid email address"
      this.setState({
        emailError: emailMessage,
        email_errors: true
      })
      isValidate = false;
    }
    if (!email_pattern.test(this.state.email)) {
      var emailMessage = "Please enter a valid email address"
      this.setState({
        emailError: emailMessage,
        email_errors: true
      })
      isValidate = false;
    }
    if (this.state.address === "") {
      var addressMessage = "Please enter a valid address"
      this.setState({
        addressError: addressMessage,
        address_errors: true
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
    if (!this.state.yesprorata && !this.state.noprorata) {
      var message = "Please choose an option"
      this.setState({
        choice_errors: true,
        helper_text: message
      })
      isValidate = false;
    }
    return isValidate;
  }

  getMeterList() {
    return new Promise((resolve, reject) => {
      axios.get(`/ass_meter/${this.state.property_id}`).then((response) => {
        var list = []
        console.log(this.state.tenant_id, response.data);
        for (var i = 0; i < response.data.length; i++) {
          // console.log("tenant_id  ", this.state.tenant_id);
          if (response.data[i].tenant_id == this.state.tenant_id) {
            list.push(response.data[i].meter_id)
          }
        }
        this.setState({ meter_list: list });
        resolve();
      });
    });
  }

  onSubmit(event) {
    event.preventDefault();
    var res = [];
    if (this.state.meter_list.length !== 0) {
      this.setState({
        meter_errors: true,
        meter_helper_text: "",
      })
    }
    if (this.validation()) {
      if (this.state.noprorata && !this.state.yesprorata) {
        this.setState({
          open: false,
          nameError: "",
          addressError: "",
          emailError: "",
          phoneError: "",
          name_errors: false,
          address_errors: false,
          email_errors: false,
          phone_errors: false,
          choice_errors: false,
          helper_text: "",
          rubs_errors: false,
          rubs_helper_text: "",
          percent_errors: false,
          percent_helper_text: "",
          meter_errors: false,
          meter_helper_text: "",
        });
        var tenant_info = {
          name: this.state.name,
          email: this.state.email,
          address: this.state.address,
          landlord_phone: this.state.landlord_phone,
          rubs: this.state.rubs,
          property_id: this.state.property_id,
        };
        var tenant_id = this.state.tenant_id;
        this.updateTenantInfo(tenant_id, tenant_info);
      } else {
        if (this.state.meter_list.length === 0) {
          console.log("meter_list length: " + this.state.meter_list)
          var meter_message = "Please select at least one meter number"
          this.setState({
            meter_errors: true,
            meter_helper_text: meter_message
          })
        } else if (this.state.yesprorata && !this.state.yes && !this.state.no) {
          var rubs_message = "Please choose an option"
          this.setState({
            rubs_errors: true,
            rubs_helper_text: rubs_message
          })
        } else if (this.state.yesprorata) {
          if (this.state.tenantFt === "" && (this.state.rubs === "" || this.state.rubs > 1 || this.state.rubs < 0)) {
            var rubs_message = "Please enter a valid percentage"
            this.setState({
              percent_errors: true,
              percent_helper_text: rubs_message
            })
          } else if ((this.state.rubs === "" || !this.state.rubs) && (this.state.tenantFt === "" || this.state.tenantFt > this.props.total_footage)) {
            var rubs_message = "Please enter a valid number"
            this.setState({
              percent_errors: true,
              percent_helper_text: rubs_message
            })
          } else if (this.state.rubs !== "" && (this.state.rubs > 1 || this.state.rubs < 0)) {
            var rubs_message = "Please enter a valid number"
            this.setState({
              percent_errors: true,
              percent_helper_text: rubs_message
            })
          } else {
            this.setState({
              open: false,
              nameError: "",
              addressError: "",
              emailError: "",
              phoneError: "",
              name_errors: false,
              address_errors: false,
              email_errors: false,
              phone_errors: false,
              choice_errors: false,
              helper_text: "",
              rubs_errors: false,
              rubs_helper_text: "",
              percent_errors: false,
              percent_helper_text: "",
              meter_errors: false,
              meter_helper_text: "",
            });
            var tenant_info = {
              name: this.state.name,
              email: this.state.email,
              address: this.state.address,
              landlord_phone: this.state.landlord_phone,
              rubs: this.state.rubs,
              property_id: this.state.property_id,
            };
            var tenant_id = this.state.tenant_id;
            this.updateTenantInfo(tenant_id, tenant_info);
          }
        } else {
          this.setState({
            open: false,
            nameError: "",
            addressError: "",
            emailError: "",
            phoneError: "",
            name_errors: false,
            address_errors: false,
            email_errors: false,
            phone_errors: false,
            choice_errors: false,
            helper_text: "",
            rubs_errors: false,
            rubs_helper_text: "",
            percent_errors: false,
            percent_helper_text: "",
            meter_errors: false,
            meter_helper_text: "",
          });
          var tenant_info = {
            name: this.state.name,
            email: this.state.email,
            address: this.state.address,
            landlord_phone: this.state.landlord_phone,
            rubs: 0,
            property_id: this.state.property_id,
          };
          var tenant_id = this.state.tenant_id;
          this.updateTenantInfo(tenant_id, tenant_info);
          this.setState({
            meter_list: []
          });
        }
      }
    }
  }

  render() {
    const isYes = this.state.yes;
    const isNo = this.state.no;
    const isYesProrata = this.state.yesprorata;
    const isNoProrata = this.state.noprorata;
    var is_validate_name = this.state.name_errors;
    var is_validate_address = this.state.address_errors;
    var is_validate_email = this.state.email_errors;
    var is_validate_phone = this.state.phone_errors;
    var name_message = this.state.nameError;
    var address_message = this.state.addressError;
    var email_message = this.state.emailError;
    var phone_message = this.state.phoneError;
    var is_validate_choice = this.state.choice_errors;
    var helper = this.state.helper_text;
    var is_validate_rubs = this.state.rubs_errors;
    var helper_rubs = this.state.rubs_helper_text;
    var is_validate_percent = this.state.percent_errors;
    var helper_percent = this.state.percent_helper_text;
    var is_validate_meter = this.state.meter_errors;
    var helper_meter = this.state.meter_helper_text;
    return (
      <div>
        <Button color="primary" onClick={this.handleClickOpen}>
          Edit
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Enter Tenant Information</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
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
              id="email"
              label="Email Address"
              type="email"
              value={this.state.email}
              onChange={this.changeEmail}
              helperText={is_validate_email ? email_message : null}
              error={this.state.email_errors}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="address"
              label="Address"
              type="text"
              value={this.state.address}
              onChange={this.changeAddress}
              helperText={is_validate_address ? address_message : null}
              error={this.state.address_errors}
              fullWidth
            />
            <NumberFormat
              customInput={TextField}
              autoFocus
              margin="dense"
              id="landlord_phone"
              label="Landlord Phone"
              type="text"
              value={this.state.landlord_phone}
              onChange={this.changeLandlordPhone}
              helperText={is_validate_phone ? phone_message : null}
              error={this.state.phone_errors}
              fullWidth
              format="(###) ###-####"
            />
            <DialogContent />
            <FormControl error={is_validate_choice}>
              <FormLabel>
                Is this Tenant Billed based off a Percentage (Pro-Rata) Share of Building?
                <DialogContentText />
                <WhatIsProRataShare />
              </FormLabel>
              <FormHelperText>{helper}</FormHelperText>
              <FormGroup row>
                <FormControlLabel disabled control={<Checkbox checked={this.state.yesprorata} onChange={this.onChangeYesProrata} name="yes" color="primary" />} label="yes" />
                <FormControlLabel disabled control={<Checkbox checked={this.state.noprorata} onChange={this.onChangeNoProrata} name="no" color="primary" />} label="no" />
              </FormGroup>
              <DialogContent></DialogContent>
              <div>
                {isYesProrata ? (
                  <div>
                    <FormControl error={is_validate_meter}>
                      <MeterCheckBox
                        property_id={this.props.property_id}
                        onlyOption={false}
                        cur_meter_list={this.state.cur_meter_list}
                        tenant_id={this.state.tenant_id}
                        methodfromparent={this.getAssociatedMeter}
                      />
                      <FormHelperText>{helper_meter}</FormHelperText>
                    </FormControl>
                    {/* <TextField autoFocus margin="dense" id="multiplier" label="Is there a multiplier?" type="text" onChange={this.changeMultiplier} fullWidth />
                    <WhatIsMultiplier /> */}
                    <DialogContent></DialogContent>
                    <FormControl error={is_validate_rubs}>
                      <FormLabel>
                        Do you have the percentage share of building of this tenant?
                        <DialogContentText />
                        <WhatIsProRataShare />
                      </FormLabel>
                      <FormHelperText>{helper_rubs}</FormHelperText>
                      <FormGroup row>
                        <FormControlLabel control={<Checkbox checked={this.state.yes} onChange={this.onChangeYes} name="yes" color="primary" />} label="yes" />
                        <FormControlLabel control={<Checkbox checked={this.state.no} onChange={this.onChangeNo} name="no" color="primary" />} label="no" />
                      </FormGroup>
                      <DialogContent></DialogContent>
                      <div>
                        {isYes ? (
                          <div>
                            <NumberFormat
                              customInput={TextField}
                              autoFocus
                              margin="dense"
                              id="rubs"
                              label="Enter Percentage Share of Building"
                              type="text"
                              fullWidth
                              onChange={this.changeRUBS}
                              helperText={is_validate_percent ? helper_percent : null}
                              error={this.state.percent_errors}
                              suffix="%"
                              value={this.state.rubs * 100}
                            />
                          </div>
                        ) : null}
                        {isNo ? (
                          <div>
                            <div>Total buildings square footage: {this.props.total_footage}</div>
                            <NumberFormat
                              customInput={TextField}
                              autoFocus
                              margin="dense"
                              id="tenantFt"
                              label="Enter tenant square footage"
                              type="text"
                              onChange={this.changeTenantFt}
                              fullWidth
                              helperText={is_validate_percent ? helper_percent : null}
                              error={this.state.percent_errors}
                            />
                            <TextField
                              autoFocus
                              margin="dense"
                              label="Percentage share"
                              fullWidth
                              value={this.state.rubs * 100 + "%"}
                            />
                            {/* <Button onClick={this.calculate} color="primary">
                              Calculate
                            </Button> */}
                          </div>
                        ) : null}
                      </div>
                    </FormControl>
                  </div>
                ) : null}
                {isNoProrata ? (
                  <div>

                  </div>
                ) : null}
              </div>
            </FormControl>
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

export default EditTenant;
