import React from "react";
import ReactDOM from "react-dom";
import "./../App.css";

const AWSCognito = require("amazon-cognito-identity-js");
const AWS = require("aws-sdk");

class ListUserAPI extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <button onClick={listUser}>List</button>
          </li>
        </ul>
      </div>
    );
  }
}

AWS.config.region = "us-east-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "...",
});

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
  region: AWS.config.region,
  credentials: AWS.config.credentials,
});

const params = {
  AttributesToGet: [],
  Filter: "",
  Limit: 10,
  UserPoolId: "us-east-2_9sP4CUJwB",
};
const listUser = () => {
  cognitoidentityserviceprovider.listUsers(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
};

export default ListUserAPI;
