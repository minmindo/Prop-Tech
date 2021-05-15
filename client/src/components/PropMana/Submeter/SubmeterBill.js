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
import BillTimeCheckBox from "../../BillTimeCheckBox";
class SubmeterBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      submeter_bill_id: "",
      bill_id: "",
      submeter_id: this.props.submeter_id,
      prior_read: "",
      current_read: "",
      from_date: "",
      to_date: "",
      amt_due: "",
      meter_id: this.props.meter_id,
      multiplier: this.props.multiplier,
      unit_charge: "",
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.changePriorRead = this.changePriorRead.bind(this);
    this.changeCurrentRead = this.changeCurrentRead.bind(this);
    this.changeAmountDue = this.changeAmountDue.bind(this);
    this.calculate = this.calculate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.changeBillId = this.changeBillId.bind(this);
    this.changeFromDate = this.changeFromDate.bind(this);
    this.changeTodate = this.changeTodate.bind(this);
    this.changeUnitCharge = this.changeUnitCharge.bind(this);
  }

  submit_submeterbill(submeter_bill_info) {
    axios.post("/submeter_bill", { sub: this.props.sub, submeter_bill_info: submeter_bill_info }).then((response) => {});
  }

  changeBillId(bill_id) {
    this.setState({
      bill_id: bill_id,
    });
  }
  changeUnitCharge(unit_charge) {
    this.setState({
      unit_charge: Number(unit_charge),
    });
  }
  changeFromDate(date) {
    this.setState({
      from_date: date,
    });
  }
  changeTodate(date) {
    this.setState({
      to_date: date,
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
    });
  }

  changePriorRead(event) {
    this.setState({
      prior_read: Number(event.target.value),
    });
  }

  changeCurrentRead(event) {
    this.setState({
      current_read: Number(event.target.value),
    });
  }

  changeAmountDue(event) {
    this.setState({
      amt_due: event.target.value,
    });
  }

  calculate() {
    console.log("unit charge: ", this.state.unit_charge);
    var tmp_s_kwh_usage = this.state.current_read - this.state.prior_read;
    console.log("kwh usage: ", tmp_s_kwh_usage);
    var tmp_amt_with_multiplier = tmp_s_kwh_usage * Number(this.state.multiplier);
    console.log("kwh usage with multiplier: ", tmp_amt_with_multiplier);
    console.log("multiplier: ", this.state.multiplier);

    var xbill_id = this.state.bill_id;
    var xsubmeter_id = this.state.submeter_id;
    var xprior_read = this.state.prior_read;
    var xcur_read = this.state.current_read;
    var xfrom_date = this.state.from_date;
    var xto_date = this.state.to_date;
    var xs_kwh_usage = tmp_s_kwh_usage;
    var xamt_with_multiplier = tmp_amt_with_multiplier;
    var xamt_due = tmp_amt_with_multiplier * Number(this.state.unit_charge);

    this.setState({
      amt_due: xamt_due,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({
      open: false,
    });
    console.log("unit charge: ", this.state.unit_charge);
    var tmp_s_kwh_usage = this.state.current_read - this.state.prior_read;
    console.log("kwh usage: ", tmp_s_kwh_usage);
    var tmp_amt_with_multiplier = tmp_s_kwh_usage * Number(this.state.multiplier);
    console.log("kwh usage with multiplier: ", tmp_amt_with_multiplier);
    console.log("multiplier: ", this.state.multiplier);
    var submeter_bill_info = {
      bill_id: this.state.bill_id,
      submeter_id: this.state.submeter_id,
      prior_read: this.state.prior_read,
      cur_read: this.state.current_read,
      from_date: this.state.from_date,
      to_date: this.state.to_date,
      s_kwh_usage: tmp_s_kwh_usage,
      amt_with_multiplier: tmp_amt_with_multiplier,
      amt_due: tmp_amt_with_multiplier * Number(this.state.unit_charge),
    };
    // let bill_id = submeter_bill_info.bill_id;
    // let submeter_id = submeter_bill_info.submeter_id;
    // let prior_read = submeter_bill_info.prior_read;
    // let cur_read = submeter_bill_info.cur_read;
    // let from_date = submeter_bill_info.from_date;
    // let to_date = submeter_bill_info.to_date;
    // let cur_amt = submeter_bill_info.s_kwh_usage;
    // let amt_with_multiplier = submeter_bill_info.amt_with_multiplier;
    // let amt_due = submeter_bill_info.amt_due;
    {
      /* submit_submeterbill not so sure about parameter */
    }
    this.submit_submeterbill(submeter_bill_info);
    console.log(submeter_bill_info);
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen} color="primary">
          Create Submeter Bill
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Input submeter bill manually</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="submeter"
              label="Submeter"
              type="text"
              //value will be current submeter value
              value={this.props.submeter_id}
              fullWidth
            />
            <DialogContent></DialogContent>
            {console.log("submeter bill: meter id", this.state.meter_id)}
            <BillTimeCheckBox
              meter_id={this.state.meter_id}
              changeBillId={this.changeBillId.bind(this)}
              changeFromDate={this.changeFromDate.bind(this)}
              changeTodate={this.changeTodate.bind(this)}
              changeUnitCharge={this.changeUnitCharge.bind(this)}
              onlyOption={true}
            />
            <TextField autoFocus margin="dense" id="prior_read" label="Prior read" type="number" onChange={this.changePriorRead} fullWidth />
            <TextField autoFocus margin="dense" id="current_read" label="Current read" type="number" onChange={this.changeCurrentRead} fullWidth />
            <TextField autoFocus margin="dense" id="amt_due" label="Amount due" type="number" onChange={this.changeAmountDue} value={this.state.amt_due} fullWidth />
            <Button color="primary" onClick={this.calculate}>
              Calculate
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default SubmeterBill;
