import React from "react";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import axios from "axios";
{
  /* meter_1 and meter_2 are temporary hardcode variables used for demostration 
    onlyOption specifies whether checkbox allows multiple selection or single selection
    true=single selection, false=multiple selection
*/
}
class BillTimeCheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      from_date: "",
      to_date: "",
      submeter_id: "",
      bill_id: "",
      unit_charge: "",
      bill_list: [],
      meter_id: this.props.meter_id,
      onlyOption: true,
    };
    this.onChangeOnlyOption = this.onChangeOnlyOption.bind(this);
    this.getBillList = this.getBillList.bind(this);
    this.set_timeperiod = this.set_timeperiod.bind(this);
  }

  getBillList() {
    //use meter_id to find all meter bills
    console.log(this.state.meter_id);
    return new Promise((resolve, reject) => {
      axios.get(`/meterbill_list/${this.state.meter_id}`).then((response) => {
        console.log("response from database: ", response.data);
        this.setState({ bill_list: response.data }, () => {
          console.log("bill list", this.state.bill_list);
          resolve();
        });
      });
      //  console.log("bill list:", this.state.bill_list);
    });
  }

  set_timeperiod(bill_id) {
    for (var i = 0; i < this.state.bill_list.length; i++) {
      if (this.state.bill_list[i].bill_id == bill_id) {
        console.log("the match bill_id: ", bill_id);
        this.setState({
          unit_charge: this.state.bill_list[i].unit_charge,
          from_date: this.state.bill_list[i].from_date,
          to_date: this.state.bill_list[i].to_date,
        });
      }
    }
  }

  componentDidMount() {
    this.generateTable();
  }

  onChangeOnlyOption(event) {
    {
      /* this part should also return the chosen bill id */
    }
    console.log("checkbox bill_id: ", event.target.value);
    this.set_timeperiod(event.target.value);
    this.setState({ bill_id: event.target.value }, function () {
      this.props.changeBillId(this.state.bill_id);
      this.props.changeFromDate(this.state.from_date);
      this.props.changeTodate(this.state.to_date);
      this.props.changeUnitCharge(this.state.unit_charge);
    });
  }

  generateTable() {
    var res = [];
    console.log(this.state.bill_list);
    this.getBillList().then(() => {
      var tableData = this.state.bill_list;
      console.log(tableData.length);
      for (var i = 0; i < tableData.length; i++) {
        console.log("from date", tableData[i].from_date);
        res.push(
          <FormControlLabel
            key={String(tableData[i].bill_id)}
            // name={Number(tableData[i].bill_id)}
            value={String(tableData[i].bill_id)}
            control={<Radio />}
            label={String(tableData[i].from_date.split("T")[0] + " to " + tableData[i].to_date.split("T")[0])}
          />
        );
      }
      this.res = res;
      console.log(this.res);
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div>
        {this.state.onlyOption ? (
          <div>
            <FormControl>
              <FormLabel>Which time period this submeter bill assign to?</FormLabel>
              <RadioGroup aria-label="bill_id" onChange={this.onChangeOnlyOption}>
                {this.res}
              </RadioGroup>
            </FormControl>
          </div>
        ) : (
          <div>{/* <FormControl>
              <FormLabel>Which meter number is associated with this tenant?</FormLabel>
              {this.res}
            </FormControl> */}</div>
        )}
      </div>
    );
  }
}

export default BillTimeCheckBox;
