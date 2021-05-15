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
import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IndividualTenantInvoice from "./IndividualTenantInvoice";
import Snackbar from '@material-ui/core/Snackbar';
import { TableContainer } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

class InvoiceHistory_m extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from_date: "",
      to_date: "",
      bill_id: "",
      meter_id: "",
      account_id: "",
      m_kwh_usage: "",
      s_kwh_usage: "",
      s_charge: "",
      total_kwh_usage: "",
      total_charge: "",
      unit_charge: "",
      invoice_list: [],
      property_id: this.props.property_id,
      tenant_list: this.props.tenant_list,
      property_info: this.props.property_info,
      billing_dates: [],
      tenant_id: 0,
      current_res: [],
      current_resm: [],
      button_flag: false,
      helper_text: "",
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.getMeterInvoiceList = this.getMeterInvoiceList.bind(this);
    this.getInvoiceDateList = this.getInvoiceDateList.bind(this);
    this.getTenantList = this.getTenantList.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.generateMeterTable = this.generateMeterTable.bind(this);
    this.generateDateTable = this.generateDateTable.bind(this);
    this.getCurrentInvoice = this.getCurrentInvoice.bind(this);
    this.getCurrentInvoice_sub = this.getCurrentInvoice_sub.bind(this);
    this.handleClose = this.handleClose.bind(this);
    // this.generateMeterTable();
    this.generateDateTable();
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

  getCurrentInvoice(cur_res, invoice, tenant, property) {
    console.log("test test:", cur_res, invoice, tenant, property)
    this.setState({
      current_res: cur_res,
      invoice_list: invoice,
      tenant_list: tenant,
      property_info: property
    });
  }

  getCurrentInvoice_sub(cur_resm) {
    console.log("test test:", cur_resm)
    this.setState({
      current_resm: cur_resm,
    });
  }

  getTenantList() {
    return new Promise((resolve, reject) => {
      axios.get(`/tenant/${this.props.property_id}`).then((response) => {
        this.setState({ tenant_list: response.data });
        resolve();
      });
    });
  }

  getInvoiceDateList() {
    return new Promise((resolve, reject) => {
      axios.post(`/select_timePeriod_invoice/${this.state.tenant_id}`).then((response) => {
        this.setState({
          billing_dates: response.data
        }, () => {
          console.log("response from database: ", response.data);
          resolve();
        });
      });
    });
  }

  getMeterInvoiceList() {
    return new Promise((resolve, reject) => {
      axios.post("/invoice_history", { property_id: this.state.property_id, from_date: this.state.from_date, to_date: this.state.to_date }).then((response) => {
        console.log("invoice history response:", response.data);
        this.setState({
          invoice_list: response.data.invoice_list,
          tenant_list: response.data.tenant_list,
          property_info: response.data.property_info,
        });
        this.forceUpdate();
        resolve();
        if (response.data.invoice_list == false || response.data.invoice_list.length === 0) {
          alert("no invoice in selecting time peirod, make sure  generate invoice first using {Generate Invoice} on the side bar");
          return;
        }
      });
    });
  }

  generateDateTable() {
    var resd = [];
    this.getTenantList().then(() => {
      var tableDataTenant = this.state.tenant_list;
      console.log(tableDataTenant);
      this.setState({
        tenant_id: tableDataTenant[0].tenant_id
      })
      console.log(this.state.tenant_id)
      this.getInvoiceDateList().then(() => {
        var tableDataDate = this.state.billing_dates;
        console.log("current date: ", tableDataDate)
        for (var i = 0; i < tableDataDate.length; i++) {
          resd.push(
            <TableRow key={i} id={i}>
              <TableCell>{tableDataDate[i].from_date.split("T")[0]}</TableCell>
              <TableCell>{tableDataDate[i].to_date.split("T")[0]}</TableCell>
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
                  from_date={tableDataDate[i].from_date.split("T")[0]}
                  to_date={tableDataDate[i].to_date.split("T")[0]}
                  methodfromparent={this.getCurrentInvoice}
                  methodfromparenttwo={this.getCurrentInvoice_sub}
                />
              </TableCell>
              <TableCell />
            </TableRow>
          )
        }
        this.resd = resd;
        this.forceUpdate();
      });
    });
    // console.log(current_tenant_id)
  }

  generateMeterTable() {
    var res = [];
    var resm = [];
    var name = "";
    var rubs = 0;
    var total_footage = 0;
    var total_building_amt_due = 0;
    var total_kwh_usage = 0;
    var temp_tenant_id = 0;
    this.getMeterInvoiceList().then(() => {
      var tableData = this.state.invoice_list;
      var tableDataTenant = this.state.tenant_list;
      var tableDataProperty = this.state.property_info;
      console.log(this.state.invoice_list);
      console.log(tableDataTenant);
      console.log(tableDataProperty);
      if (tableData.length > 0) {
        var text = "Viewing invoice of " + this.state.from_date + " to " + this.state.to_date;
        this.setState({
          button_flag: true,
          helper_text: text
        })
      }
      for (var i = 0; i < tableData.length; i++) {
        for (var j = 0; j < tableDataTenant.length; j++) {
          if (tableData[i].tenant_id === tableDataTenant[j].tenant_id) {
            name = tableDataTenant[j].name;
            rubs = tableDataTenant[j].rubs;
            total_footage = rubs * tableDataProperty[0].total_footage;
            total_building_amt_due = tableData[i].total_charge / rubs;
            total_building_amt_due = total_building_amt_due.toFixed(2);
            if (tableData[i].has_submeter === "y") {
              total_kwh_usage = tableData[i].cur_read - tableData[i].prior_read;
            }
          }
        }
        if (rubs !== 0) {
          res.push(
            <TableRow key={i} id={i}>
              <TableCell>{tableData[i].invoice_id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{tableData[i].meter_id}</TableCell>
              <TableCell>{tableData[i].from_date.split("T")[0]}</TableCell>
              <TableCell>{tableData[i].to_date.split("T")[0]}</TableCell>
              <TableCell>{tableData[i].meter_amt_due}</TableCell>
              <TableCell>{rubs * 100 + "%"}</TableCell>
              <TableCell>{total_footage}</TableCell>
              <TableCell>{tableDataProperty[0].total_footage}</TableCell>
              <TableCell>{total_building_amt_due}</TableCell>
              <TableCell>{tableData[i].total_charge}</TableCell>
            </TableRow>
          );
        } else {
          resm.push(
            <TableRow key={i} id={i}>
              <TableCell>{tableData[i].invoice_id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{tableData[i].submeter_id}</TableCell>
              <TableCell>{tableData[i].from_date.split("T")[0]}</TableCell>
              <TableCell>{tableData[i].to_date.split("T")[0]}</TableCell>
              <TableCell>{tableData[i].submeter_charge}</TableCell>
              <TableCell>{tableData[i].prior_read}</TableCell>
              <TableCell>{tableData[i].cur_read}</TableCell>
              <TableCell>{total_kwh_usage}</TableCell>
              <TableCell>{tableData[i].unit_charge}</TableCell>
              <TableCell>{tableData[i].total_charge}</TableCell>
            </TableRow>
          );
        }
      }
      this.res = res;
      this.resm = resm;
      this.setState({
        current_res: res,
        current_resm: resm,
      })
      this.forceUpdate();
    });
  }

  onSubmit() {
    if (this.state.from_date == "" || this.state.to_date == "") {
      alert("please select a time period");
      return;
    }
    this.generateMeterTable();
    // if (this.state.invoice_list.length !== 0) {
    //   var text = "Viewing invoice of " + this.state.from_date + " to " + this.state.to_date;
    //   this.setState({
    //     button_flag: true,
    //     helper_text: text
    //   })
    // }
    // this.generateDateTable();
  }

  handleClose() {
    this.setState({
      button_flag: false
    })
  };

  render() {
    return (
      <React.Fragment>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Invoice Statement History
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
                <TableCell>Invoice Start Date</TableCell>
                <TableCell>Invoice End Date</TableCell>
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
            <TableBody>{this.resd}</TableBody>
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
        <TableContainer style={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Tenant Name</TableCell>
                <TableCell>Meter ID</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Meter Amount Due</TableCell>
                <TableCell>RUBS</TableCell>
                <TableCell>User Footage</TableCell>
                <TableCell>Total Footage</TableCell>
                <TableCell>Total Building Amount Due</TableCell>
                <TableCell>Total Tenant Amount Due</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.state.current_res}</TableBody>
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
          <Divider />
          <TableContainer style={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Tenant Name</TableCell>
                <TableCell>Submeter ID</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Submeter Charge</TableCell>
                <TableCell>Prior Read</TableCell>
                <TableCell>Current Read</TableCell>
                <TableCell>Total KWH Usage</TableCell>
                <TableCell>Unit Charge</TableCell>
                <TableCell>Total Amount Due</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.state.current_resm}</TableBody>
          </Table>
        </TableContainer>
        <IndividualTenantInvoice
          property_info={this.state.property_info}
          tenant_list={this.state.tenant_list}
          invoice_list={this.state.invoice_list}
        />
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
      current_res: [],
      current_resm: [],
      invoice_list: [],
      tenant_list: [],
      property_info: [],
      button_flag: false,
      helper_text: "",
    }
    this.getMeterInvoiceList = this.getMeterInvoiceList.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  getMeterInvoiceList() {
    return new Promise((resolve, reject) => {
      axios.post("/invoice_history", { property_id: this.state.property_id, from_date: this.state.from_date, to_date: this.state.to_date }).then((response) => {
        console.log("invoice history response:", response.data);
        this.setState({
          invoice_list: response.data.invoice_list,
          tenant_list: response.data.tenant_list,
          property_info: response.data.property_info,
        });
        this.forceUpdate();
        resolve();
        if (response.data.invoice_list == false || response.data.invoice_list.length === 0) {
          alert("no invoice in selecting time peirod, make sure  generate invoice first using {Generate Invoice} on the side bar");
          return;
        }
      });
    });
  }

  generateMeterTable() {
    var res = [];
    var resm = [];
    var name = "";
    var rubs = 0;
    var total_footage = 0;
    var total_building_amt_due = 0;
    var total_kwh_usage = 0;
    var temp_tenant_id = 0;
    this.getMeterInvoiceList().then(() => {
      var tableData = this.state.invoice_list;
      var tableDataTenant = this.state.tenant_list;
      var tableDataProperty = this.state.property_info;
      console.log(this.state.invoice_list);
      console.log(tableDataTenant);
      console.log(tableDataProperty);
      if (tableData.length > 0) {
        var text = "Viewing invoice of " + this.state.from_date + " to " + this.state.to_date;
        this.setState({
          button_flag: true,
          helper_text: text
        })
      }
      for (var i = 0; i < tableData.length; i++) {
        for (var j = 0; j < tableDataTenant.length; j++) {
          if (tableData[i].tenant_id === tableDataTenant[j].tenant_id) {
            name = tableDataTenant[j].name;
            rubs = tableDataTenant[j].rubs;
            total_footage = rubs * tableDataProperty[0].total_footage;
            total_building_amt_due = tableData[i].total_charge / rubs;
            total_building_amt_due = total_building_amt_due.toFixed(2);
            if (tableData[i].has_submeter === "y") {
              total_kwh_usage = tableData[i].cur_read - tableData[i].prior_read;
            }
          }
        }
        if (rubs !== 0) {
          res.push(
            <TableRow key={i} id={i}>
              <TableCell>{tableData[i].invoice_id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{tableData[i].meter_id}</TableCell>
              <TableCell>{tableData[i].from_date.split("T")[0]}</TableCell>
              <TableCell>{tableData[i].to_date.split("T")[0]}</TableCell>
              <TableCell>{tableData[i].meter_amt_due}</TableCell>
              <TableCell>{rubs * 100 + "%"}</TableCell>
              <TableCell>{total_footage}</TableCell>
              <TableCell>{tableDataProperty[0].total_footage}</TableCell>
              <TableCell>{total_building_amt_due}</TableCell>
              <TableCell>{tableData[i].total_charge}</TableCell>
            </TableRow>
          );
        } else {
          resm.push(
            <TableRow key={i} id={i}>
              <TableCell>{tableData[i].invoice_id}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{tableData[i].submeter_id}</TableCell>
              <TableCell>{tableData[i].from_date.split("T")[0]}</TableCell>
              <TableCell>{tableData[i].to_date.split("T")[0]}</TableCell>
              <TableCell>{tableData[i].submeter_charge}</TableCell>
              <TableCell>{tableData[i].prior_read}</TableCell>
              <TableCell>{tableData[i].cur_read}</TableCell>
              <TableCell>{total_kwh_usage}</TableCell>
              <TableCell>{tableData[i].unit_charge}</TableCell>
              <TableCell>{tableData[i].total_charge}</TableCell>
            </TableRow>
          );
        }
      }
      this.res = res;
      this.resm = resm;
      this.setState({ current_res: res, current_resm: resm }, () => {
        this.props.methodfromparent(res, this.state.invoice_list, this.state.tenant_list, this.state.property_info);
        this.props.methodfromparenttwo(resm);
      });
      console.log("tryone" + this.state.current_resm)
      this.forceUpdate();
    });
  }

  onSubmit() {
    console.log(this.state.property_id, this.state.from_date, this.state.to_date, this.state.invoice_list, this.state.tenant_list)
    this.generateMeterTable();
    this.forceUpdate();
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

export default InvoiceHistory_m;
