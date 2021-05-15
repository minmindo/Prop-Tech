import "date-fns";
import React from "react";
import "./../App.css";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import DialogContentText from "@material-ui/core/DialogContentText";
import DeleteMetersBill from "./DeleteMeterBill";
import { isThisISOWeek } from "date-fns";
import DeleteSubMeterBill from "./DeleteSubMeterBill";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Snackbar from '@material-ui/core/Snackbar';

class BillingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property_id: this.props.property_id,
      tenant_list: this.props.tenant_list,
      from_date: "",
      to_date: "",
      submeter_bill_id: "",
      bill_id: "",
      submeter_id: "",
      prior_read: "",
      current_read: "",
      amt_due: "",
      bill_list: [],
      submeter_bill_list: [],
      unit_charge: "",
      meter_id: this.props.meter_id,
      billing_dates: [],
      current_resm: [],
      current_res: [],
      button_flag: false,
      helper_text: "",
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.getMeterBillList = this.getMeterBillList.bind(this);
    this.getSubmeterBillList = this.getSubmeterBillList.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getBillingDates = this.getBillingDates.bind(this);
    this.getCurrentBill = this.getCurrentBill.bind(this);
    this.getCurrentSubBill = this.getCurrentSubBill.bind(this);
    this.getHelperText = this.getHelperText.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.generateBillingDateTable();
  }

  componentDidMount() {
    // this.generateMeterTable();
    // this.generateSubmeterTable();
  }

  handleFromDateChange(event) {
    this.setState(
      {
        from_date: event.target.value,
      },
      () => {
        console.log(this.state.from_date);
      }
    );
  }

  handleToDateChange(event) {
    this.setState(
      {
        to_date: event.target.value,
      },
      () => {
        console.log(this.state.to_date);
      }
    );
  }

  getBillingDates() {
    return new Promise((resolve, reject) => {
      axios.get(`/alltime_period/${this.state.property_id}`).then((response) => {
        this.setState({
          billing_dates: response.data
        }, () => {
          console.log("response from database: ", response.data);
          resolve();
        });
      });
    });
  }

  getMeterBillList() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `/history_meterbill_list/${this.state.property_id}/${this.state.from_date}/${this.state.to_date}
            `
        )
        .then((response) => {
          console.log("response from database: ", response.data);
          this.setState({ bill_list: response.data }, () => {
            console.log("bill list", this.state.bill_list);
            resolve();
          });
        });
      //  console.log("bill list:", this.state.bill_list);
    });
  }

  getSubmeterBillList() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `/history_submeterbill_list/${this.state.property_id}/${this.state.from_date}/${this.state.to_date}
            `
        )
        .then((response) => {
          console.log("response from database: ", response.data);
          this.setState({ submeter_bill_list: response.data }, () => {
            console.log("submeter bill list", this.state.submeter_bill_list);
            resolve();
          });
        });
      //  console.log("bill list:", this.state.bill_list);
    });
  }

  onSubmit() {
    if (this.state.from_date == "" || this.state.to_date == "") {
      alert("please select a time period");
      return;
    }
    this.generateMeterTable();
    this.generateSubmeterTable();
    var text = "Viewing bill of " + this.state.from_date + " to " + this.state.to_date;
    this.setState({
      button_flag: true,
      helper_text: text
    })
    console.log("bill list length:", this.state.bill_list.length);
    console.log(this.state.from_date, this.state.to_date, this.state.bill_list, this.state.submeter_bill_list);
  }

  getCurrentBill(cur_resm) {
    console.log("test test:", cur_resm)
    this.setState({
      current_resm: cur_resm,
      // current_res: cur_res,
    });
  }

  getCurrentSubBill(cur_res) {
    console.log("test test:", cur_res)
    this.setState({
      current_res: cur_res,
      // current_res: cur_res,
    });
  }

  getHelperText(help) {
    console.log("helper: ", help)
    this.setState({
      helper_text: help,
    })
  }

  handleClose() {
    this.setState({
      button_flag: false
    })
  };

  generateMeterTable() {
    var resm = [];
    this.getMeterBillList().then(() => {
      var tableData = this.state.bill_list;
      if (tableData.length == 0) {
        alert("No bills in current time period, please manually input !");
        return;
      }
      console.log(this.state.bill_list);
      for (var i = 0; i < tableData.length; i++) {
        resm.push(
          <TableRow key={i} id={i}>
            <TableCell>{tableData[i].bill_id}</TableCell>
            <TableCell>{tableData[i].meter_id}</TableCell>
            <TableCell>{tableData[i].from_date.split("T")[0]}</TableCell>
            <TableCell>{tableData[i].to_date.split("T")[0]}</TableCell>
            <TableCell>{tableData[i].total_kwh_usage}</TableCell>
            {/* <TableCell>{tableData[i].unit_charge}</TableCell> */}
            <TableCell>{tableData[i].total_charge}</TableCell>
          </TableRow>
        );
      }
      this.resm = resm;
      this.setState({
        current_resm: resm
      })
      this.forceUpdate();
    });
  }

  generateSubmeterTable() {
    var res = [];
    console.log("where are you", this.state.submeter_bill_list)
    this.getSubmeterBillList().then(() => {
      var tableData = this.state.submeter_bill_list;

      console.log(this.state.submeter_bill_list);
      for (var i = 0; i < tableData.length; i++) {
        res.push(
          <TableRow key={i} id={i}>
            <TableCell>{tableData[i].submeter_bill_id}</TableCell>
            <TableCell>{tableData[i].bill_id}</TableCell>
            <TableCell>{tableData[i].submeter_id}</TableCell>
            <TableCell>{tableData[i].prior_read}</TableCell>
            <TableCell>{tableData[i].cur_read}</TableCell>
            <TableCell>{tableData[i].unit_charge}</TableCell>
            <TableCell>{tableData[i].amt_due}</TableCell>
          </TableRow>
        );
      }
      this.res = res;
      this.setState({
        current_res: res
      })
      this.forceUpdate();
    });
  }

  generateBillingDateTable() {
    var resb = [];
    this.getBillingDates().then(() => {
      var tableData = this.state.billing_dates;
      console.log("bill date::", this.state.billing_dates)
      if (tableData[0].from_date === null) {
        return;
      }
      for (var i = 0; i < tableData.length; i++) {
        // var temp_from = tableData[i].from_date.split("T")[0];
        // var temp_to = tableData[i].to_date.split("T")[0];
        resb.push(
          <TableRow key={i} id={i}>
            <TableCell>{tableData[i].from_date.split("T")[0]}</TableCell>
            <TableCell>{tableData[i].to_date.split("T")[0]}</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell>
              <ShowDate
                property_id={this.props.property_id}
                // tenant_list={this.props.tenant_list}
                from_date={tableData[i].from_date.split("T")[0]}
                to_date={tableData[i].to_date.split("T")[0]}
                methodfromparent={this.getCurrentBill}
                methodfromparenttwo={this.getCurrentSubBill}
                methodfromparentthree={this.getHelperText}
              />
            </TableCell>
            <TableCell />
          </TableRow>
        )
      }
      this.resb = resb;
      this.forceUpdate();

    });

  }

  render() {
    return (
      <React.Fragment>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Billing History
        </Typography>
        <TableContainer style={{ maxHeight: 600 }}>
          <form noValidate>
            <TextField
              id="from_date"
              label="From"
              type="date"
              defaultValue={this.state.from_date}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleFromDateChange}
            />
            <TextField
              id="to_date"
              label="To"
              type="date"
              defaultValue={this.state.to_date}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleToDateChange}
            />
          </form>
          <DialogContentText />
          <Button onClick={this.onSubmit} color="primary">
            Show
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={this.state.button_flag}
            autoHideDuration={6000}
            onClose={this.handleClose}
            message={this.state.helper_text}
          />
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Billing Start Date</TableCell>
                <TableCell>Billing End Date</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {this.resb}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <TableContainer style={{ maxHeight: 400 }} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Meter Bill ID</TableCell>
                <TableCell>Meter</TableCell>
                <TableCell>Billing Start Date</TableCell>
                <TableCell>Billing End Date</TableCell>
                <TableCell>Total KWH Usage</TableCell>
                {/* <TableCell>Unit Charge</TableCell> */}
                <TableCell>Total Charge</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>{this.state.current_resm}</TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <TableContainer style={{ maxHeight: 400 }} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Submeter Bill ID</TableCell>
                <TableCell>Associate with Bill ID:</TableCell>
                <TableCell>Submeter</TableCell>
                <TableCell>Prior Read</TableCell>
                <TableCell>Current Read</TableCell>
                <TableCell>Unit Charge</TableCell>
                <TableCell>Amount Due</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>{this.state.current_res}</TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
  }
}

class ShowDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property_id: this.props.property_id,
      // tenant_list: this.props.tenant_list,
      from_date: this.props.from_date,
      to_date: this.props.to_date,
      current_resm: [],
      current_res: [],
      bill_list: [],
      submeter_bill_list: [],
      button_flag: false,
      helper_text: "",
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.getMeterBillList = this.getMeterBillList.bind(this);
    this.getSubmeterBillList = this.getSubmeterBillList.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  getMeterBillList() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `/history_meterbill_list/${this.state.property_id}/${this.state.from_date}/${this.state.to_date}
            `
        )
        .then((response) => {
          this.setState({ bill_list: response.data }, () => {
            resolve();
          });
        });
      //  console.log("bill list:", this.state.bill_list);
    });
  }

  getSubmeterBillList() {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `/history_submeterbill_list/${this.state.property_id}/${this.state.from_date}/${this.state.to_date}
            `
        )
        .then((response) => {
          this.setState({ submeter_bill_list: response.data }, () => {
            resolve();
          });
        });
      //  console.log("bill list:", this.state.bill_list);
    });
  }

  generateMeterTable() {
    var resm = [];
    this.getMeterBillList().then(() => {
      var tableData = this.state.bill_list;
      if (tableData.length == 0) {
        alert("No bills in current time period, please manually input !");
        return;
      }
      for (var i = 0; i < tableData.length; i++) {
        resm.push(
          <TableRow key={i} id={i}>
            <TableCell>{tableData[i].bill_id}</TableCell>
            <TableCell>{tableData[i].meter_id}</TableCell>
            <TableCell>{tableData[i].from_date.split("T")[0]}</TableCell>
            <TableCell>{tableData[i].to_date.split("T")[0]}</TableCell>
            <TableCell>{tableData[i].total_kwh_usage}</TableCell>
            {/* <TableCell>{tableData[i].unit_charge}</TableCell> */}
            <TableCell>{tableData[i].total_charge}</TableCell>
            <TableCell>
              <DeleteMetersBill bill_id={tableData[i].bill_id} generateTableData={this.onSubmit} />
            </TableCell>
          </TableRow>

        );
      }
      this.resm = resm;
      // this.setState({
      //   current_resm: resm
      // })
      this.setState({ current_resm: resm }, () => {
        this.props.methodfromparent(resm);
      });
      console.log("tryone" + this.state.current_resm)
      // this.forceUpdate();
    });
    // this.setState({
    //   current_resm: resm
    // })
    // console.log("tryonepointfive", resm)
    // this.forceUpdate();
    // console.log("trytwo", this.state.current_resm)
    // return resm;
  }

  generateSubmeterTable() {
    var res = [];
    this.getSubmeterBillList().then(() => {
      var tableData = this.state.submeter_bill_list;
      for (var i = 0; i < tableData.length; i++) {
        res.push(
          <TableRow key={i} id={i}>
            <TableCell>{tableData[i].submeter_bill_id}</TableCell>
            <TableCell>{tableData[i].bill_id}</TableCell>
            <TableCell>{tableData[i].submeter_id}</TableCell>
            <TableCell>{tableData[i].prior_read}</TableCell>
            <TableCell>{tableData[i].cur_read}</TableCell>
            <TableCell>{tableData[i].unit_charge}</TableCell>
            <TableCell>{tableData[i].amt_due}</TableCell>
            <TableCell>
              <DeleteSubMeterBill bill_id={tableData[i].submeter_bill_id} generateTableData={this.onSubmit} />
            </TableCell>
          </TableRow>
        );
      }
      this.res = res;
      this.setState({ current_res: res }, () => {
        this.props.methodfromparenttwo(res);
      });
      this.forceUpdate();
    });
    // this.setState({
    //   current_res: res
    // })
  }

  onSubmit() {
    console.log(this.state.property_id, this.state.from_date, this.state.to_date)
    this.generateMeterTable();
    this.generateSubmeterTable();
    var text = "Viewing bill of " + this.state.from_date + " to " + this.state.to_date;
    this.setState({
      button_flag: true,
      helper_text: text
    }, () => {
      this.props.methodfromparentthree(text)
    })
    this.forceUpdate();
    // this.setState({

    // }, function () {
    //   console.log("current resm: "+this.state.current_resm)
    //   this.props.methodfromparent(this.state.current_resm, this.state.current_res);
    // })
    // console.log("cirrent:", );
    // this.props.methodfromparent(this.state.current_resm, this.res);
  }

  handleClose() {
    this.setState({
      button_flag: false
    })
  };

  render() {
    return (
      <React.Fragment>
        <Button color="primary" onClick={this.onSubmit}>
          Show
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.button_flag}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={this.state.helper_text}
        />
      </React.Fragment>
    );
  }
}

export default BillingHistory;
