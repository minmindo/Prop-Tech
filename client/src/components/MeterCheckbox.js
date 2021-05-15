import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
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
class MeterCheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meter_list: this.props.meter_list,
      cur_meter_list: this.props.cur_meter_list,
      meter_id: "",
      property_id: this.props.property_id,
      tenant_id: this.props.tenant_id,
      onlyOption: this.props.onlyOption,
      select_meter_list: "",
      meter_error: false,
      helper_text: "",
      chosen: false,
    };
    this.onChangeOnlyOption = this.onChangeOnlyOption.bind(this);
    this.onChangeMultiOption = this.onChangeMultiOption.bind(this);
    this.get_current_meter_list = this.get_current_meter_list.bind(this);
    this.get_current_meter_list();
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

  getCurrentMeterList() {
    return new Promise((resolve, reject) => {
      axios.get(`/ass_meter/${this.state.property_id}`).then((response) => {
        var list = []
        console.log(this.state.tenant_id, response.data);
        for (var i = 0; i < response.data.length; i++) {
          // console.log("tenant_id  ", this.state.tenant_id);
          if (response.data[i].tenant_id == this.state.tenant_id) {
            list.push(response.data[i].meter_id)
          }
        }
        this.setState({ cur_meter_list: list });
        resolve();
      });
    });
  }

  componentDidMount() {
    // this.generateTable();
  }

  onChangeOnlyOption(event) {
    {
      /* this part should also return the chosen meter value */
    }
    this.setState({ meter_id: event.target.value }, function () {
      this.props.methodfromparent(this.state.meter_id);
    });
  }

  onChangeMultiOption(event) {
    event.preventDefault();
    // console.log("event target name", event.target.name);
    // this.getCurrentMeterList().then(() => {
    //   let current = this.state.cur_meter_list;
    //   for (var i = 0; i < current.length; i++) {
    //     if (event.target.name === current[i]) {
    //       console.log("current meter is !!!!"+current[i], "newstate: " + this.state.newState[i])
    //       this.setState({
    //         newState: event.target.checked,
    //       })
    //     }
    //   }
    // });
    this.setState({
      [event.target.name]: event.target.checked,
    }, function () {
      this.props.methodfromparent(event.target.name);
    });
    this.generateTable();
  }

  get_current_meter_list() {
    this.getCurrentMeterList().then(() => {
      let current = this.state.cur_meter_list;
      for (var i = 0; i < current.length; i++) {
        this.setState({
          [current[i]]: true
        })
        console.log(current[i])
      }
    });
    this.forceUpdate();
  }

  meter_submeter_validate() {
    var isValidate = true;
    if (this.state.meter_id === "") {
      this.setState({
        meter_error: true,
        helper_text: "Please select associated meter number"
      })
      isValidate = false;
    }
    return isValidate;
  }

  generateTable() {
    var res = [];
    this.getMeterList().then(() => {
      var tableData = this.state.meter_list;
      if (this.state.onlyOption === true) {
        for (var i = 0; i < tableData.length; i++) {
          res.push(<FormControlLabel key={tableData[i].meter_id} name={tableData[i].meter_id} value={tableData[i].meter_id} control={<Radio />} label={tableData[i].meter_id} />);
        }
        this.res = res;
        this.forceUpdate();
      } else {
        this.cur = [];
        this.getCurrentMeterList().then(() => {
          let current = this.state.cur_meter_list;
          for (var i = 0; i < current.length; i++) {
            this.cur.push(current[i]);
          }
          console.log("meterlist:!! " + this.cur)
          for (var i = 0; i < tableData.length; i++) {
            let isChosen = false;
            for (var j = 0; j < this.cur.length; j++) {
              if (this.cur[j] === tableData[i].meter_id) {
                isChosen = true;
              }
            }
            if (isChosen) {
              res.push(
                <FormControlLabel 
                  key={tableData[i].meter_id} 
                  control={<Checkbox checked={this.state[tableData[i].meter_id]}
                                     onChange={this.onChangeMultiOption}
                                     name={tableData[i].meter_id} color="primary" 
                          />} 
                  label={tableData[i].meter_id} />
              );
            } else {
              res.push(
                <FormControlLabel key={tableData[i].meter_id} control={<Checkbox onChange={this.onChangeMultiOption} name={tableData[i].meter_id} color="primary" />} label={tableData[i].meter_id} />
              );
            }
          }
          this.res = res;
          this.forceUpdate();
        });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.onlyOption ? (
          <div>
            <FormControl>
              <FormLabel>Which meter number is associated with this submeter?</FormLabel>
              <RadioGroup aria-label="meter" onChange={this.onChangeOnlyOption}>
                {this.res}
              </RadioGroup>
            </FormControl>
          </div>
        ) : (
          <div>
            <FormControl>
              <FormLabel>Which meter number is associated with this tenant?</FormLabel>
              {this.res}
            </FormControl>
          </div>
        )}
      </div>
    );
  }
}

export default MeterCheckBox;
