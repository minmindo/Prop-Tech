const config = require("./config.json");

const db = require("./database");
const emailer = require("./email");
const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const verifier = require("cognito-express");
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const cognito = new aws.CognitoIdentityServiceProvider({
  region: config.aws_region,
});

const accessVerifier = new verifier({
  region: config.aws_region,
  cognitoUserPoolId: config.cognito.userPoolId,
  tokenUse: "access",
  tokenExpiration: 3600000,
});

const idVerifier = new verifier({
  region: config.aws_region,
  cognitoUserPoolId: config.cognito.userPoolId,
  tokenUse: "id",
  tokenExpiration: 3600000,
});

const verifyClient = async (req, res, callback) => {
  accessVerifier.validate(req.cookies.authCookie.accessToken, (err, accessData) => {
    if (err) {
      res.status(401).send(err);
    } else {
      idVerifier.validate(req.cookies.authCookie.idToken, (err2, idData) => {
        if (err2) {
          res.status(401).send(err2);
        } else {
          callback(accessData, idData);
        }
      });
    }
  });
};

// req json needs email, password, street_name, company_name, suite_number, city, state, zipcode
router.post("/signup", (req, res) => {
  var params = {
    ClientId: config.cognito.clientId,
    Username: req.body.email,
    Password: req.body.password,
    UserAttributes: [
      {
        Name: "custom:street_name",
        Value: req.body.street_name,
      },
      {
        Name: "custom:company_name",
        Value: req.body.company_name,
      },
      {
        Name: "custom:suite_number",
        Value: req.body.suite_number,
      },
      {
        Name: "custom:city",
        Value: req.body.city,
      },
      {
        Name: "custom:state",
        Value: req.body.state,
      },
      {
        Name: "custom:zipcode",
        Value: req.body.zipcode,
      },
      {
        Name: "custom:is_activated",
        Value: "False",
      },
    ],
  };

  cognito.signUp(params, (err, data) => {
    if (err) {
      res.json(err);
    }
  });
});

router.get("/users", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    if (accessData["cognito:groups"][0] == "Admin") {
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    var params = { UserPoolId: config.cognito.userPoolId };

    cognito.listUsers(params, (err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    });
  });
});

// req json needs email, sub
// req cookie needs admin group
router.post("/activate", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    if (accessData["cognito:groups"][0] != "Admin") {
      res.json({
        error: {
          message: "Improper permissions: not admin",
        },
      });
      return;
    }

    var params = {
      UserPoolId: config.cognito.userPoolId,
      Username: req.body.sub,
      UserAttributes: [
        {
          Name: "custom:is_activated",
          Value: "True",
        },
      ],
    };

    cognito.adminUpdateUserAttributes(params, (err, data) => {
      if (err) {
        res.json(err);
      } else {
        var params = {
          GroupName: "PropertyManager",
          UserPoolId: config.cognito.userPoolId,
          Username: req.body.sub,
        };

        cognito.adminAddUserToGroup(params, (err2, data2) => {
          if (err2) {
            res.json(err2);
          } else {
            db.insertUserId(req.body.sub, (results) => {
              emailer.sentEmail(req.body.email, `The PropTech Web App Account associated with ${req.body.email} email has been approved`);
              res.json(data);
            });
          }
        });
      }
    });
  });
});

// req json needs sub
// req cookie needs admin group
router.delete("/reject", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    if (accessData["cognito:groups"][0] != "Admin") {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    var params = {
      UserPoolId: config.cognito.userPoolId,
      Username: req.body.sub,
    };

    cognito.adminDeleteUser(params, (err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    });
  });
});

// req json needs accessToken
router.post("/auth", (req, res) => {
  accessVerifier.validate(req.body.accessToken, (err, accessData) => {
    if (err) {
      res.status(401).send(err);
    } else {
      idVerifier.validate(req.body.idToken, (err2, idData) => {
        if (err2) {
          res.status(401).send(err2);
        } else {
          console.log(req.body);
          res.cookie("authCookie", { accessToken: req.body.accessToken, idToken: req.body.idToken }, { httpOnly: true });
          res.json({ accessData, idData });
        }
      });
    }
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("authCookie").send();
});

// req json needs sub if admin group
// req cookie needs admin or propertyManager group
router.get("/property/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.selectAllProperties(sub, (results) => {
      res.json(JSON.parse(JSON.stringify(results)));
    });
    console.log(res.body);
  });
});

// req json needs property info (and sub if admin group)
// req cookie needs admin or propertyManager group
router.patch("/property", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.updateProperty(sub, req.body.property_info, (results) => {
      res.json(results);
    });
  });
});

// req json needs property info (and sub if admin group)
// req cookie needs admin or propertyManager group
router.post("/property", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.insertProperty(sub, req.body.property_info, (results) => {
      res.json(results);
    });
  });
});

// req json needs property_id (and sub if admin group)
// req cookie needs admin or propertyManager group
router.delete("/property", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.deleteProperty(sub, req.body.property_id, (results) => {
      res.json(results);
    });
  });
});

//request to get tenant list
router.get("/tenant/:property_id?/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.selectAllTenants(req.params.property_id, (results) => {
      res.json(JSON.parse(JSON.stringify(results)));
    });
  });
});
// request to delete tenant
router.delete("/tenant", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.deleteTenant(req.body.property_id, req.body.tenant_id, (result) => {
      res.json(result);
    });
  });
});

// request to update tenant info
router.patch("/tenant", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    console.log();
    db.deleteAllMeterTenantRelation(req.body.tenant_id, (pre_result) => {
      db.updateTenant(req.body.tenant_id, req.body.tenant_info, (result) => {
        res.json(result);
      });
    });
    for (var i = 0; i < req.body.meter_list.length; i++) {
      db.associateMeterWithTenant(Number(req.body.meter_list[i]), Number(req.body.tenant_id), (result3) => {});
    }
  });
});

//add new tenant to list
router.post("/tenant", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    db.insertTenant(req.body.property_id, req.body.tenant_info, (result) => {
      res.json(result);
      var filter = {
        name: req.body.tenant_info.name,
        email: req.body.tenant_info.email,
        address: req.body.tenant_info.address,
        landlord_phone: req.body.tenant_info.landlord_phone,
      };
      console.log("meter list:", req.body.meter_list);
      db.selectTenant(filter, (result1) => {
        console.log("tenant_id", JSON.parse(JSON.stringify(result1[0].tenant_id)));
        var tenant_id = JSON.parse(JSON.stringify(result1[0].tenant_id));
        for (var i = 0; i < req.body.meter_list.length; i++) {
          db.associateMeterWithTenant(Number(req.body.meter_list[i]), Number(tenant_id), (result3) => {});
        }
      });
    });
  });
});

//get submeter list by tenant id
router.get("/submeter/:tenant_id?/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    db.selectAllSubmeters(req.params.tenant_id, (results) => {
      res.json(JSON.parse(JSON.stringify(results)));
    });
  });
});

//delete submeter
router.delete("/delete_submeter", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.deleteSubmeter(req.body.tenant_id, req.body.submeter_id, (result) => {
      res.json(result);
    });
  });
});

router.post("/add_submeter", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.insertSubmeter(req.body, (result) => {
      res.json(result);
    });
  });
});

router.get("/meter/:property_id?/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    db.selectAllMeters(req.params.property_id, (results) => {
      res.json(JSON.parse(JSON.stringify(results)));
    });
  });
});

router.get("/ass_meter/:property_id?/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    db.selectMeterTenantListByProperty(req.params.property_id, (results) => {
      res.json(JSON.parse(JSON.stringify(results)));
    });
  });
});

router.post("/meter", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.insertMeter(req.body.meter_id, req.body.property_id, (result) => {
      res.json(result);
    });
  });
});

router.delete("/meter", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    db.deleteMeter(req.body.meter_id, req.body.property_id, (result) => {
      res.json(result);
    });
  });
});
//add a new rubs bill to databse
router.post("/bill", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    console.log(req.body.bill_info);
    db.insertBill(req.body.bill_info, (result) => {
      res.json(result);
    });
  });
});

//add new submeter bill to database
router.post("/submeter_bill", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    console.log(req.body.submeter_bill_info);
    db.insertSubmeterBill(req.body.submeter_bill_info, (result) => {
      res.json(result);
    });
  });
});

//get meter bills list by filter
router.post("/meterbill_list/", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    db.selectAllMetersSubmetersByProperty(Number(req.body.property_id), (result) => {
      db.selectBillWithProperty({ property_id: Number(req.body.property_id), from_date: req.body.from_date, to_date: req.body.to_date }, (result2) => {
        db.selectMeterSubmeterBillByProperty(Number(req.body.property_id), req.body.from_date, req.body.to_date, (result3) => {
          db.selectMeterTenantListByProperty(Number(req.body.property_id), (result4) => {
            db.selectAllTenants(Number(req.body.property_id), (result5) => {
              var final_result = {
                meter_submeter_list: JSON.parse(JSON.stringify(result)),
                meter_bill_list: JSON.parse(JSON.stringify(result2)),
                submeter_bill_list: JSON.parse(JSON.stringify(result3)),
                meter_tenant_list: JSON.parse(JSON.stringify(result4)),
                all_tenant_list: JSON.parse(JSON.stringify(result5)),
              };
              console.log("final result:", final_result);
              res.json(final_result);
            });
          });
        });
      });
    });
  });
});
//get meter bills list by filter
router.get("/meterbill_list/:meter_id?/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    var filter = { meter_id: Number(req.params.meter_id) };
    db.selectBill(filter, (result) => {
      console.log(result);
      res.json(result);
    });
  });
});
router.get("/history_meterbill_list/:property_id?/:from_date?/:to_date?/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    var filter = {
      property_id: Number(req.params.property_id),
      from_date: String(req.params.from_date),
      to_date: String(req.params.to_date),
    };
    db.selectBillWithProperty(filter, (result) => {
      console.log(result);
      res.json(result);
    });
  });
});

//use this function to get all time period for certain property
router.get("/alltime_period/:property_id?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    var filter = {
      property_id: Number(req.params.property_id),
    };
    db.selectAllTime_WithProperty(filter, (result) => {
      console.log(result);
      res.json(result);
    });
  });
});

router.get("/history_submeterbill_list/:property_id?/:from_date?/:to_date?/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    var filter = {
      property_id: Number(req.params.property_id),
      from_date: req.params.from_date,
      to_date: req.params.to_date,
    };
    db.selectMeterSubmeterBillByProperty(filter.property_id, filter.from_date, filter.to_date, (result) => {
      console.log(result);
      res.json(result);
    });
  });
});
//use this function to get all time_period for invoices , input: teant_id list
router.post("/select_timePeriod_invoice/:tenant_id?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    var filter = {
      tenant_id: Number(req.params.tenant_id),
    };
    db.TimePeriod_Invoice(filter, (results) => {
      res.json(JSON.parse(JSON.stringify(results)));
    });
  });
});

router.post("/upload_invoice", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    console.log("receive by server: ", req.body);
    var final_invoice_list = req.body.final_invoice_list;
    console.log("length: ", final_invoice_list.length);

    //check if the invoice has been generated previously
    var filter = {
      tenant_id: req.body.final_invoice_list[0].tenant_id,
      from_date: req.body.final_invoice_list[0].from_date.split("T")[0],
      to_date: req.body.final_invoice_list[0].to_date.split("T")[0],
    };

    db.selectInvoice(filter, (results) => {
      console.log("result=", results);
      if (results.length != 0) {
        // console.log("hhhhh");
        res.json(JSON.parse(JSON.stringify(results)));
      } else {
        // console.log("add to table");
        for (var i = 0; i < final_invoice_list.length; i++) {
          var invoice = final_invoice_list[i];
          var has_submeter = invoice.has_submeter;
          //for each tenant

          for (var j = 0; j < final_invoice_list[i].charge_list.length; j++) {
            //for each sub invoice
            if (invoice.rubs != 0) {
              console.log("has submeter:", has_submeter);
              var sub_invoice = final_invoice_list[i].charge_list[j];
              var invoice_info = {
                tenant_id: invoice.tenant_id,
                from_date: invoice.from_date,
                to_date: invoice.to_date,
                total_charge: invoice.total_charge,
                has_submeter: "n",
                rubs: invoice.rubs,

                submeter_id: "",
                prior_read: 0,
                cur_read: 0,
                unit_charge: 0,
                submeter_charge: 0,
                multiplier: 0,

                meter_amt_due: sub_invoice.meter_amt_due,
                meter_id: sub_invoice.meter_id,
              };

              db.insertInvoice(invoice_info, (result2) => {
                console.log(result2);
              });
            } else {
              var sub_invoice = final_invoice_list[i].charge_list[j];
              var invoice_info = {
                tenant_id: invoice.tenant_id,
                from_date: invoice.from_date,
                to_date: invoice.to_date,
                total_charge: invoice.total_charge,
                has_submeter: "y",
                rubs: invoice.rubs,

                submeter_id: sub_invoice.submeter_id,
                prior_read: sub_invoice.prior_read,
                cur_read: sub_invoice.cur_read,
                unit_charge: sub_invoice.unit_charge,
                submeter_charge: sub_invoice.amt_due,
                multiplier: sub_invoice.multiplier,

                meter_amt_due: 0,
                meter_id: 0,
              };
              db.insertInvoice(invoice_info, (result3) => {
                console.log(result3);
              });
            }
          }
        }
        res.json(JSON.parse(JSON.stringify(results)));
      }
    });
  });
});

router.post("/invoice_history", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    db.selectAllTenants(req.body.property_id, (results1) => {
      var tenant_list = JSON.parse(JSON.stringify(results1));
      console.log("tenant_list length: ", tenant_list.length);
      db.selectProperty(req.body.property_id, (results3) => {
        var list = [];
        for (var i = 0; i < tenant_list.length; i++) {
          list.push(Number(tenant_list[i].tenant_id));
        }
        var filter = {
          tenant_id: list,
          from_date: req.body.from_date.split("T")[0],
          to_date: req.body.to_date.split("T")[0],
        };
        db.selectInvoice(filter, (results2) => {
          console.log("invoice length", results2.length);
          var output = {
            tenant_list: JSON.parse(JSON.stringify(results1)),
            invoice_list: JSON.parse(JSON.stringify(results2)),
            property_info: JSON.parse(JSON.stringify(results3)),
          };
          res.json(output);
          // console.log(results);
        });
      });
    });
  });
});

router.get("/history_meterinvoice_list/:property_id?/:from_date?/:to_date?/:sub?", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.params.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    db.selectAllTenants(req.body.property_id, (results1) => {
      var tenant_list = JSON.parse(JSON.stringify(results1));
      console.log("tenant_list length: ", tenant_list.length);
      db.selectProperty(req.body.property_id, (results3) => {
        var list = [];
        for (var i = 0; i < tenant_list.length; i++) {
          list.push(Number(tenant_list[i].tenant_id));
        }
        var filter = {
          tenant_id: list,
          from_date: req.body.from_date.split("T")[0],
          to_date: req.body.to_date.split("T")[0],
        };
        db.selectInvoice(filter, (results2) => {
          console.log("invoice length", results2.length);
          var output = {
            tenant_list: JSON.parse(JSON.stringify(results1)),
            invoice_list: JSON.parse(JSON.stringify(results2)),
            property_info: JSON.parse(JSON.stringify(results3)),
          };
          res.json(output);
          // console.log(results);
        });
      });
    });
  });
});

router.post("/sendPDFToTenant", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }

    //console.log(req.body.data);

    let subject = "invoice";
    let html = "<p>Invoice attached<p>";

    let emailBody = {
      receiver: req.body.receiver,
      subject: subject,
      html: html,
      path: req.body.path,
    };
    emailer.sentEmailWithAttachment(emailBody, (results) => {
      res.json(results);
    });
  });
});

router.delete("/deletebill", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    console.log("router bill id", req.body.bill_in);
    db.deleteBill(req.body.bill_id, (results) => {
      res.json(results);
    });
  });
});
router.delete("/deletesub_bill", (req, res) => {
  verifyClient(req, res, (accessData, idData) => {
    var sub;
    if (accessData["cognito:groups"][0] == "Admin") {
      sub = req.body.sub;
    } else if (accessData["cognito:groups"][0] == "PropertyManager") {
      sub = accessData.sub;
    } else {
      res.json({
        error: {
          message: "Improper permissions: not Admin",
        },
      });
      return;
    }
    console.log("router bill id", req.body.bill_in);
    db.deleteSubmeterBill(req.body.bill_id, (results) => {
      res.json(results);
    });
  });
});
module.exports = router;
