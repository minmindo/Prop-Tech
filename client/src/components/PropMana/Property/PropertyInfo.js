import React from "react";
import "./../../../App.css";
import AddProperty from "./AddProperty";
import EditProperty from "./EditProperty";
import DeleteProperty from "./DeleteProperty";
import { Component } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { DialogContent } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

class PropertyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      property_list: [],
    };
    this.generateTableData = this.generateTableData.bind(this);
    this.getPropertyList = this.getPropertyList.bind(this);
    this.generateTableData();
  }

  getPropertyList() {
    return new Promise((resolve, reject) => {
      axios.get(`/property/${this.props.sub}`).then((response) => {
        this.setState({ property_list: response.data });
        resolve();
      });
    });
  }

  generateTableData() {
    this.getPropertyList().then(() => {
      this.res = [];
      for (var i = 0; i < this.state.property_list.length; i++) {
        this.res.push(
          <TableRow key={i} id={i}>
            <TableCell>{this.state.property_list[i].name}</TableCell>
            <TableCell>{this.state.property_list[i].address}</TableCell>
            <TableCell>{this.state.property_list[i].total_footage}</TableCell>
            <TableCell>{this.state.property_list[i].landlord_phone}</TableCell>
            <TableCell>
              <ManageTenants
                sub={this.props.sub}
                is_admin={this.props.is_admin}
                property_id={this.state.property_list[i].property_id}
                name={this.state.property_list[i].name}
                total_footage={this.state.property_list[i].total_footage}
                landlord_phone={this.state.property_list[i].landlord_phone}
              />
            </TableCell>
            <TableCell>
              <EditProperty
                sub={this.props.sub}
                property_id={this.state.property_list[i].property_id}
                name={this.state.property_list[i].name}
                address={this.state.property_list[i].address}
                total_footage={this.state.property_list[i].total_footage}
                landlord_phone={this.state.property_list[i].landlord_phone}
                generateTableData={this.generateTableData}
              />
            </TableCell>
            <TableCell>
              <DeleteProperty sub={this.props.sub} property_id={this.state.property_list[i].property_id} generateTableData={this.generateTableData} />
            </TableCell>
          </TableRow>
        );
      }
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className="main">
        <TableHead>
          <TableCell component={Paper}>
            <AddProperty className="display_item" sub={this.props.sub} generateTableData={this.generateTableData} />
          </TableCell>
        </TableHead>
        <DialogContent />
        <TableContainer style={{ maxHeight: 700 }} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Property Name</TableCell>
                <TableCell>Property Address</TableCell>
                <TableCell>Total Footage</TableCell>
                <TableCell>Landlord Phone</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>{this.res}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

class ManageTenants extends Component {
  manage_tenants = () => {
    sessionStorage.setItem("property_name", this.props.name);
    sessionStorage.setItem("property_id", this.props.property_id);
    sessionStorage.setItem("total_footage", this.props.total_footage);
    sessionStorage.setItem("landlord_phone", this.props.landlord_phone)
    if (this.props.is_admin == true) {
      window.location = `/Admin/PropMana/${this.props.sub}/property/${this.props.property_id}`;
    } else {
      window.location = `/PropMana/${this.props.sub}/property/${this.props.property_id}`;
    }
  };

  render() {
    return (
      <Button onClick={this.manage_tenants} color="primary">
        View Details
      </Button>
    );
  }
}

export default PropertyInfo;
