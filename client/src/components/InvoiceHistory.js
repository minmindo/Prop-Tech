import React, { Component } from "react";
import InvoiceHistory_m from "./InvoiceHistory_m";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import axios from "axios";

class InvoiceHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenant_list: [],
    };
    this.getTenantList = this.getTenantList.bind(this);
    this.getTenantList();
  }

  getTenantList() {
    return new Promise((resolve, reject) => {
      axios.get(`/tenant/${this.props.property_id}`).then((response) => {
        this.setState({ tenant_list: response.data });
        resolve();
      });
    });
  }

  render() {
    const useStyles = makeStyles((theme) => ({
      container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
      paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
      },
      fixedHeight: {
        height: 240,
      },
    }));
    return (
      <div className="leftOffset">
        <React.Fragment>
          <Container maxWidth="lg" className={useStyles.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <Paper>
                  <InvoiceHistory_m className="display_item" property_id={this.props.property_id} tenant_list={this.state.tenant_list} info={this} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Paper>
                  {/* <InvoiceHistory_sub
                    className="display_item"
                    property_id={this.props.property_id}
                    tenant_list={this.state.tenant_list}
                    info={this}
                  /> */}
                </Paper>
              </Grid>
            </Grid>
          </Container>
          {/* <IndividualTenantInvoice
            tenant_list={this.state.tenant_list}
          /> */}
        </React.Fragment>
      </div>
    );
  }
}

export default InvoiceHistory;
