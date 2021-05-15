import React from "react";
import "./../../../App.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DatePicker from "./../../DatePicker.js";

class MeterBillPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,

      checked: false /*for check box status*/,
      setCheck: false /*for check box status*/,

      meter_id: this.props.meter_id,
      begin: "",
      end: "",
      m_kwh_usage: 0,
      m_charge: 0,
      /*second bill info */
      s_kwh_usage: 0,
      s_charge: 0,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changeMeter = this.changeMeter.bind(this);
    this.changeBegin = this.changeBegin.bind(this);
    this.changeEnd = this.changeEnd.bind(this);
    this.changeKWH = this.changeKWH.bind(this);
    // this.changeAmount = this.changeAmount.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeBill = this.changeBill.bind(this);
    /*second bill handlers */
    this.change_sec_KWH = this.change_sec_KWH.bind(this);
    this.change_sec_bill_amount = this.change_sec_bill_amount.bind(this);

    /*handle check box change event*/
    this.changeCheckBox = this.changeCheckBox.bind(this);
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
  changeBill(event) {
    this.setState({
      m_charge: Number(event.target.value),
    });
  }
  changeMeter(event) {
    this.setState({
      meter_id: event.target.value,
    });
  }

  changeBegin(time) {
    this.setState({
      begin: time,
    });
    console.log(this.begin);
  }

  changeEnd(time) {
    this.setState({
      end: time,
    });
  }

  changeKWH(event) {
    this.setState({
      m_kwh_usage: Number(event.target.value),
    });
  }

  // changeAmount(event) {
  //   this.setState({
  //     m_charge: event.target.value,
  //   });
  // }

  change_sec_KWH(event) {
    this.setState({
      s_kwh_usage: Number(event.target.value),
    });
  }

  change_sec_bill_amount(event) {
    this.setState({
      s_charge: Number(event.target.value),
    });
  }

  changeCheckBox(event) {
    this.setState({
      setCheck: event.target.checked,
    });
  }

  submitBill(bill_info) {
    axios.post("/bill", { sub: this.props.sub, bill_info: bill_info }).then((response) => {
      //this.props.info.generateTableBill();
    });

    /* the bill should be saved in somewhere of database */
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      open: false,
    });
    var tmp_m_kwh_usage = this.state.m_kwh_usage;
    var tmp_s_kwh_usage = this.state.s_kwh_usage;
    var tmp_total_kwh_usage = tmp_m_kwh_usage + tmp_s_kwh_usage;
    var tmp_total_charge = this.state.m_charge + this.state.s_charge;
    var tmp_unit_charge = tmp_total_charge / tmp_total_kwh_usage;

    var bill_info = {
      account_id: "60c5c41d-b8b2-40d5-925b-0f482f112f13", //leave account id as test account
      meter_id: this.state.meter_id,
      from_date: this.state.begin,
      to_date: this.state.end,
      m_kwh_usage: this.state.m_kwh_usage,
      m_charge: this.state.m_charge,
      //second bill info
      s_kwh_usage: this.state.s_kwh_usage,
      s_charge: this.state.s_charge,

      //total kwh usage, charge, unit charge
      total_kwh_usage: tmp_total_kwh_usage,
      total_charge: tmp_total_charge,
      unit_charge: tmp_unit_charge,
    };

    this.submitBill(bill_info);
    console.log(bill_info);
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} color="primary">
          Manually Input The Bill
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Enter Billing Info</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>

            <TextField autoFocus margin="dense" id="meter_code" label={"meter# " + this.state.meter_id} type="text" disabled fullWidth />
            <DatePicker from_date={this.changeBegin.bind(this)} to_date={this.changeEnd.bind(this)} />
            <TextField autoFocus margin="dense" id="kwh_rate" label="KWH" type="number" onChange={this.changeKWH} fullWidth />
            <TextField autoFocus margin="dense" id="m_charge" label="bill $" type="number" onChange={this.changeBill} fullWidth />

            <FormControlLabel
              control={<Checkbox checked={this.state.setCheck} onChange={this.changeCheckBox} inputProps={{ "aria-label": "primary checkbox" }} />}
              label="Add third party energy supply billing information"
            />
            <TextField autoFocus margin="dense" id="kwh_rate" label="KWH" type="number" disabled={!this.state.setCheck} onChange={this.change_sec_KWH} fullWidth />
            <TextField autoFocus margin="dense" id="2nd_bill_amount" label="2nd_bill $" type="number" disabled={!this.state.setCheck} onChange={this.change_sec_bill_amount} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              Upload
            </Button>
            {/* <Button onClick={this.onSubmit} color="primary">
              Fetch Bill by API
            </Button> */}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default MeterBillPage;
