import React from "react";
import "./../../../App.css";
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
import axios from "axios";

class CollapseMeter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      tenant_id: this.props.tenant_id,
      email: this.props.email,
      address: this.props.address,
      phone_number: this.props.phone_number,
      multiplier_list: [],
      multiplier: "",
      property_id: this.props.property_id,
      meter_id: this.props.meter_id,
      meter_list: [],
      meter: "",
    };
    this.getMeterList = this.getMeterList.bind(this);
    this.generateTable();
  }

  getMeterList() {
    return new Promise((resolve, reject) => {
      axios.get(`/ass_meter/${this.state.property_id}`).then((response) => {
          var list = []
          // console.log(this.state.tenant_id, response.data);
          for(var i = 0; i < response.data.length; i++){
            // console.log("tenant_id  ", this.state.tenant_id);
            if(response.data[i].tenant_id == this.state.tenant_id){
                list.push(response.data[i].meter_id)
            }
          }
        this.setState({ meter_list: list });
        resolve();
      });
    });
  }

  generateTable() {
    //call updateTable everytime when we need to generate a list of submeter and multiplier
    // see hardcode below in render() function
    var res = [];
    this.getMeterList().then(() => {
        let tableData = this.state.meter_list;
        // console.log("table", tableData);
        for (var i = 0; i < tableData.length; i++) {
          res.push(
            <TableRow key={i} id={i}>
              <TableCell>{tableData[i]}</TableCell>
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
              <Table size="small" aria-label="meter">
                <TableHead>
                  <TableRow>
                    <TableCell>Meter</TableCell>
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

export default CollapseMeter;
