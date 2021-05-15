import React from "react";
import "./../App.css";
import MeterBillPage from "./PropMana/Meter/MeterBillPage";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { TableContainer } from "@material-ui/core";

class UtilityBillMeter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meter_list: this.props.meter_list,
      meter_id: "",
      property_id: this.props.property_id,
    };
  }

  componentDidMount() {
    this.generateTable();
  }

  getMeterList() {
    return new Promise((resolve, reject) => {
      axios.get(`/meter/${this.state.property_id}`).then((response) => {
        this.setState({ meter_list: response.data }, () => {
          resolve();
        });
      });
    });
  }

  generateTable() {
    var res = [];
    this.getMeterList().then(() => {
      var tableData = this.state.meter_list;
      for (var i = 0; i < tableData.length; i++) {
        res.push(
          <TableRow key={i} id={i}>
            <TableCell key={this.state.meter_list[i].meter_id}>{this.state.meter_list[i].meter_id}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <MeterBillPage meter_id={this.state.meter_list[i].meter_id} />
            </TableCell>
          </TableRow>
        );
      }
      this.res = res;
      this.forceUpdate();
    });
  }

  render() {
    return (
      <React.Fragment>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Meters
        </Typography>
        <TableContainer style={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Meter numbers</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.res}</TableBody>
        </Table>
        </TableContainer>
      </React.Fragment>
    );
  }
}

export default UtilityBillMeter;
