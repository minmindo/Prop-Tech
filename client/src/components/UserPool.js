const cognito = require("amazon-cognito-identity-js");
const data = require("./../config.json");
const poolData = {
  UserPoolId: data.cognito.userPoolId,
  ClientId: data.cognito.clientId,
};
const userPool = new cognito.CognitoUserPool(poolData);
const region = data.aws_region;
export { cognito, userPool, region, poolData };
