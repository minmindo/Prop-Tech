import React from "react";
import "./../../../App.css";
import DeleteMeters from "./DeleteMeters";
import MeterBillPage from "./MeterBillPage";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";

class MeterTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            meter_list: [],
            meter_to_add: "",
            meter_errors: false,
            error_message: "",
            property_id: this.props.property_id,
            sub: this.props.sub,
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getMeterList = this.getMeterList.bind(this);
        this.changeMeterToAdd = this.changeMeterToAdd.bind(this);
        this.generateMeter = this.generateMeter.bind(this);
        this.validate = this.validate.bind(this);
        this.addMeter = this.addMeter.bind(this);
        this.generateMeter();
    }

    handleClickOpen() {
        this.setState({
            open: true,
        });
        this.generateMeter();
    }

    handleClose() {
        this.setState({
            open: false,
            meter_to_add: "",
            meter_errors: false,
            error_message: ""
        });
    }

    getMeterList() {
        return new Promise((resolve, reject) => {
            axios.get(`/meter/${this.props.property_id}/${this.props.sub}`).then((response) => {
                this.setState({ meter_list: response.data });
                resolve();
            });
        });
    }

    changeMeterToAdd(event) {
        this.setState({
            meter_to_add: parseInt(event.target.value),
            meter_errors: false,
            error_message: ""
        });
    }

    generateMeter() {
        this.getMeterList().then(() => {
            this.res = [];
            for (var i = 0; i < this.state.meter_list.length; i++) {
                this.res.push(
                    <TableRow key={i} id={i}>
                        <TableCell key={this.state.meter_list[i].meter_id}>{this.state.meter_list[i].meter_id}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell>
                            <DeleteMeters sub={this.props.sub} meter_id={this.state.meter_list[i].meter_id} property_id={this.props.property_id} generateMeter={this.generateMeter} />
                        </TableCell>
                        <TableCell>
                            <MeterBillPage sub={this.props.sub} meter_id={this.state.meter_list[i].meter_id} />
                        </TableCell>
                    </TableRow>
                );
            }
            this.forceUpdate();
        });
    }

    validate() {
        var isValidate = true;
        var message = "";
        if (this.state.meter_to_add === "" || !this.state.meter_to_add || this.state.meter_to_add < 0) {
            message = "Please enter valid meter number"
            this.setState({
                error_message: message,
                meter_errors: true
            })
            isValidate = false;
        }
        this.getMeterList().then(() => {
            for (var i = 0; i < this.state.meter_list.length; i++) {
                if (this.state.meter_to_add === parseInt(this.state.meter_list[i].meter_id)) {
                    message = "Meter already exists"
                    this.setState({
                        error_message: message,
                        meter_errors: true
                    })
                    isValidate = false;
                    break;
                }
            }
        });
        return isValidate;
    }

    addMeter() {
        if (this.validate()) {
            axios.post("/meter", { sub: this.props.sub, property_id: this.props.property_id, meter_id: this.state.meter_to_add }).then((response) => {
                this.generateMeter();
            });
            this.setState({
                meter_errors: false,
                error_message: ""
            })
        }
    }
    render() {
        return (
            <div>
                <TableContainer style={{ maxHeight: 300 }} component={Paper}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Meter List
                    </Typography>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Meters</TableCell>
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
                        <TableBody>{this.res}</TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default MeterTable;
