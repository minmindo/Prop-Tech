import React from "react";
import "./../../../App.css";
import EditTenant from "./EditTenant";
import AddTenant from "./AddTenant";
import DeleteTenant from "./DeleteTenant";
import Submeters from "./../Submeter/Submeters";
import Meters from "./../Meter/Meters";
import MeterTable from "./../Meter/MeterTable";
import CollapseSubmeter from "./../Submeter/CollapseSubmeter";
import CollaspseMeter from "./../Meter/CollapseMeter";
import { Component } from "react";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { DialogContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';

class TenantInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenant_list: [],
      meter_list: [],
      is_meter_tenant: false,
      is_submeter_tenant: false,
    };
    this.generateTableData = this.generateTableData.bind(this);
    this.getTenantList = this.getTenantList.bind(this);
    this.getSubmeterList = this.getSubmeterList.bind(this);
    this.generateTableData();
  }

  getTenantList() {
    return new Promise((resolve, reject) => {
      axios.get(`/tenant/${this.props.property_id}/${this.props.sub}`).then((response) => {
        this.setState({ tenant_list: response.data });
        resolve();
      });
    });
  }

  getSubmeterList() {
    return new Promise((resolve, reject) => {
      axios.get(`/submeter/${this.state.tenant_id}/${this.props.sub}`).then((response) => {
        this.setState({ submeter_list: response.data });
        resolve();
      });
    });
  }

  validate_tenant() {
    var isValidate = true;

    return isValidate;
  }

  generateTableData() {
    this.getTenantList().then(() => {
      this.res = [];
      for (var i = 0; i < this.state.tenant_list.length; i++) {
        if (this.state.tenant_list[i].rubs === 0) {
          this.setState({
            is_meter_tenant: false,
            is_submeter_tenant: true,
          });
        } else {
          this.setState({
            is_meter_tenant: true,
            is_submeter_tenant: false,
          });
        }
        console.log(this.state.tenant_list[i]);
        this.res.push(
          <TableRow key={i} id={i}>
            <TableCell>{this.state.tenant_list[i].name}</TableCell>
            <TableCell>{this.state.tenant_list[i].email}</TableCell>
            <TableCell>{this.state.tenant_list[i].address}</TableCell>
            <TableCell>{this.state.tenant_list[i].landlord_phone}</TableCell>
            <TableCell>{(this.state.tenant_list[i].rubs * 100).toFixed(2) + "%"}</TableCell>
            <TableCell>
              <EditTenant
                sub={this.props.sub}
                tenant_id={this.state.tenant_list[i].tenant_id}
                name={this.state.tenant_list[i].name}
                email={this.state.tenant_list[i].email}
                address={this.state.tenant_list[i].address}
                landlord_phone={this.state.tenant_list[i].landlord_phone}
                rubs={this.state.tenant_list[i].rubs}
                property_id={this.props.property_id}
                generateTableData={this.generateTableData}
                total_footage={sessionStorage.getItem("total_footage")}
                is_meter_tenant={this.state.is_meter_tenant}
                is_submeter_tenant={this.state.is_submeter_tenant}
              />
            </TableCell>
            <TableCell>
              <DeleteTenant sub={this.props.sub} tenant_id={this.state.tenant_list[i].tenant_id} property_id={this.props.property_id} generateTableData={this.generateTableData} />
            </TableCell>
            <React.Fragment>
              {this.state.is_submeter_tenant ? (
                <React.Fragment>
                  <TableCell>
                    <Submeters sub={this.props.sub} tenant_id={this.state.tenant_list[i].tenant_id} info={this} property_id={this.props.property_id} />
                  </TableCell>
                  <TableCell>
                    {/* <CollapseSubmeter tenant_id={this.state.tenant_list[i].tenant_id} property_id={this.props.property_id} info={this} /> */}
                  </TableCell>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <TableCell>Associated Meters : </TableCell>
                  <TableCell>
                    <CollaspseMeter tenant_id={this.state.tenant_list[i].tenant_id} property_id={this.props.property_id} info={this} />
                  </TableCell>
                </React.Fragment>
              )}
            </React.Fragment>
          </TableRow>
        );
      }
      this.forceUpdate();
    });
  }

  render() {
    console.log("property id is " + this.props.property_id)
    return (
      <div className="main">
        <TableHead>
          <TableCell component={Paper}>
            <AddTenant
              className="display_item"
              sub={this.props.sub}
              property_id={this.props.property_id}
              total_footage={sessionStorage.getItem("total_footage")}
              generateTableData={this.generateTableData}
            />
          </TableCell>
          <TableCell component={Paper}>
            <Meters className="display_item" sub={this.props.sub} property_id={this.props.property_id} />
          </TableCell>
        </TableHead>
        <DialogContent />
        <MeterTable className="display_item" sub={this.props.sub} property_id={this.props.property_id} />
        <DialogContent />
        <DialogContent />
        <Paper>
          <TableContainer style={{ maxHeight: 700 }} component={Paper}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Tenant Information
          </Typography>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Landlord Phone</TableCell>
                  <TableCell>RUBS</TableCell>
                  <TableCell></TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>{this.res}</TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    );
  }
}

export default TenantInfo;
