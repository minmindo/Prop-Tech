import { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import { Button } from "@material-ui/core";

class AdminManageUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_list: [],
    };
    this.generateTableData = this.generateTableData.bind(this);
    this.getUserList = this.getUserList.bind(this);
    this.generateTableData();
  }

  getUserList() {
    return new Promise((resolve, reject) => {
      axios.get(`/users`).then((response) => {
        this.setState({ user_list: response.data.Users });
        resolve();
      });
    });
  }

  generateTableData() {
    this.getUserList().then(() => {
      this.res1 = [];
      this.res2 = [];
      for (var i = 0; i < this.state.user_list.length; i++) {
        var attributes = this.state.user_list[i].Attributes.reduce((att, item) => Object.assign(att, { [item.Name]: item.Value }), {});
        if (attributes["custom:is_activated"] == "True") {
          this.res2.push(
            <TableRow key={i} id={i}>
              <TableCell>{attributes["sub"]}</TableCell>
              <TableCell>{attributes["email"]}</TableCell>
              <TableCell>{attributes["custom:company_name"]}</TableCell>
              <TableCell>{attributes["custom:street_name"]}</TableCell>
              <TableCell>{attributes["custom:suite_number"]}</TableCell>
              <TableCell>{attributes["custom:city"]}</TableCell>
              <TableCell>{attributes["custom:state"]}</TableCell>
              <TableCell>{attributes["custom:zipcode"]}</TableCell>
              <ViewPropManager sub={attributes["sub"]} username={attributes["email"]} company_name={attributes["custom:company_name"]}/>
            </TableRow>
          );
        } else {
          this.res1.push(
            <TableRow key={i} id={i}>
              <TableCell>{attributes["sub"]}</TableCell>
              <TableCell>{attributes["email"]}</TableCell>
              <TableCell>{attributes["custom:company_name"]}</TableCell>
              <TableCell>{attributes["custom:street_name"]}</TableCell>
              <TableCell>{attributes["custom:suite_number"]}</TableCell>
              <TableCell>{attributes["custom:city"]}</TableCell>
              <TableCell>{attributes["custom:state"]}</TableCell>
              <TableCell>{attributes["custom:zipcode"]}</TableCell>
              <AcceptButton generateTableData={this.generateTableData} sub={attributes["sub"]} email={attributes["email"]} />
              <RejectButton generateTableData={this.generateTableData} sub={attributes["sub"]} email={attributes["email"]} />
            </TableRow>
          );
        }
      }
      this.forceUpdate();
    });
  }
  render() {
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UserId</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Street Name</TableCell>
              <TableCell>Suite Number</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Zipcode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.res1}</TableBody>
          <TableBody>{this.res2}</TableBody>
        </Table>
      </div>
    );
  }
}

class RejectButton extends Component {
  decline_app = (user_id, email) => {
    axios.delete(`/reject`, { data: { sub: user_id, email: email } }).then((response) => {
      this.props.generateTableData();
    });
  };

  render() {
    return (
      <TableCell>
        <Button
          color="primary"
          onClick={() => {
            this.decline_app(this.props.sub, this.props.email);
          }}
        >
          Reject Application
        </Button>
      </TableCell>
    );
  }
}

class AcceptButton extends Component {
  accept_app = (user_id, email) => {
    axios.post(`/activate`, { sub: user_id, email: email }).then((response) => {
      this.props.generateTableData();
    });
  };

  render() {
    return (
      <TableCell>
        <Button
          color="primary"
          onClick={() => {
            this.accept_app(this.props.sub, this.props.email);
          }}
        >
          Accept Application
        </Button>
      </TableCell>
    );
  }
}

class ViewPropManager extends Component {
  viewManager = (sub, username, company_name) => {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("custom:company_name", company_name);
    window.location = `/Admin/PropMana/${sub}/property`;
  };

  render() {
    return (
      <TableCell>
        <Button
          color="primary"
          onClick={() => {
            this.viewManager(this.props.sub, this.props.username, this.props.company_name);
          }}
        >
          View User
        </Button>
      </TableCell>
    );
  }
}
export default AdminManageUsers;
