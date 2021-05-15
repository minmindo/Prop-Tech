import React from "react";
import "./../../../App.css";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Box from "@material-ui/core/Box";

class CollapseInvoiceHistory_m extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        cur_read: 0,
        from_date: "2021-04-01T00:00:00.000Z",
        has_submeter: "n",
        invoice_id: 596,
        meter_amt_due: 3427.97,
        meter_id: "112",
        multiplier: 0,
        prior_read: 0,
        rubs: 0.4,
        submeter_charge: 0,
        submeter_id: "",
        tenant_id: 48,
        to_date: "2021-04-02T00:00:00.000Z",
        total_charge: 4726.38,
        unit_charge: 0,
    };
    this.getSubmeterList = this.getSubmeterList.bind(this);
    this.generateTable();
  }

  getSubmeterList() {
    return new Promise((resolve, reject) => {
      axios.get(`/submeter/${this.state.tenant_id}`).then((response) => {
        this.setState({ submeter_list: response.data });
        resolve();
      });
    });
  }

  generateTable() {
    //call updateTable everytime when we need to generate a list of submeter and multiplier
    // see hardcode below in render() function
    var res = [];
    this.getSubmeterList().then(() => {
      let tableData = this.state.submeter_list;
      for (var i = 0; i < tableData.length; i++) {
        res.push(
          <TableRow key={i} id={i}>
            <TableCell>{tableData[i].submeter_id}</TableCell>
          </TableRow>
        );
      }
      this.res = res;
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div>
        <CollapseRow res={this.res} />
      </div>
    );
  }
}

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function CollapseRow(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const res = props.res;
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="big" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="submeter">
                <TableHead>
                  <TableRow>
                    <TableCell>Submeter</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{res}</TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default CollapseInvoiceHistory_m;
