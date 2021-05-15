var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "proptechdata.cilszlaqrtad.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "RSVAI8PWamFzCfqqTxgP",
  port: "3306",
  database: "PropTech_Test_DB",
});

function establishDatabaseConnection() {
  connection.connect(function (err) {
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }
    console.log("Connected to database.");
  });
}

// Insert user_id to database
function insertUserId(user_id, callback) {
  let sql = `INSERT INTO user (user_id) VALUES (?)`;
  let inserts = [user_id];
  connection.query(sql, inserts, function (err, result) {
    // check error type later
    if (err) {
      console.log(`not able to add user_id: ${user_id} in to database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log(`user_id: ${user_id} added`);
        callback(true);
      } else {
        console.log(`user_id: ${user_id} add failed`);
        callback(false);
      }
    }
  });
}

// delete user_id from user table
// should able to delete all data related to the user needs to be deleted
function deleteUserId(user_id, callback) {
  let sql = `DELETE FROM user WHERE user_id = ?`;
  let inserts = [user_id];
  connection.query(sql, inserts, function (err, result) {
    // check error type later
    if (err) {
      console.log(`not able to delete user_id: ${user_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("deleted");
        callback(true);
      } else {
        console.log("deleted");
        callback(false);
      }
    }
  });
}

// return list of JSON contains all tenant info for a property
function selectAllTenants(property_id, callback) {
  let sql = `SELECT * FROM tenant WHERE property_id = ?`;
  let inserts = [property_id];
  connection.query(sql, inserts, function (err, tenantList) {
    if (err) {
      console.log(`not able to select tenantList of property_id: ${property_id} from database`);
      callback(false);
    } else {
      console.log(`property_id: ${property_id} tenant list returned`);
      callback(tenantList);
    }
  });
}

// update tenant info
// update_info is a JSON contains name, email, address, landlord_phone, rubs
// return true if update successful
// return false if update failed
function updateTenant(tenant_id, update_info, callback) {
  let name = update_info.name;
  let email = update_info.email;
  let address = update_info.address;
  let landlord_phone = update_info.landlord_phone;
  let rubs = update_info.rubs;

  let sql = `UPDATE tenant set name = ?, email = ?, address = ?, landlord_phone = ?, rubs = ? WHERE tenant_id = ?`;
  let inserts = [name, email, address, landlord_phone, rubs, tenant_id];

  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to update tenant_id: ${tenant_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log(`updated!`);
        callback(true);
      } else {
        console.log("update failed");
        callback(false);
      }
    }
  });
}

// add new tenant for a property
// tenant_info is a JSON contains name, email, address, landlord_phone, rubs
// return true for added successfully
// return false for added failed
function insertTenant(property_id, tenant_info, callback) {
  let name = tenant_info.name;
  let email = tenant_info.email;
  let address = tenant_info.address;
  let landlord_phone = tenant_info.landlord_phone;
  let rubs = tenant_info.rubs;

  let sql = `INSERT INTO tenant(property_id,name,email,address,landlord_phone, rubs) VALUES(?,?,?,?,?,?)`;
  let inserts = [property_id, name, email, address, landlord_phone, rubs];

  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to add new tenant for property_id: ${property_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("added");
        callback(true);
      } else {
        console.log("add new tenant failed");
        callback(false);
      }
    }
  });
}

// delete tenant by property_id and tenant_id
// return true if delete successfully
// return false if delete failed
function deleteTenant(property_id, tenant_id, callback) {
  let sql = `DELETE FROM tenant WHERE property_id = ? AND tenant_id = ?`;
  let inserts = [property_id, tenant_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to delete property_id: ${property_id} tenant_id: ${tenant_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log(`property_id: ${property_id} tenant_id: ${tenant_id} deleted`);
        callback(true);
      } else {
        console.log(`property_id: ${property_id} tenant_id: ${tenant_id} delete failed`);
        callback(false);
      }
    }
  });
}

function selectTenant(filter, callback) {
  let sql = `SELECT * FROM tenant WHERE `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = "${filter[key]}"`;
    } else {
      sql += `${key} = "${filter[key]}" AND `;
    }
  });
  console.log(sql);
  connection.query(sql, function (err, tenantList) {
    if (err) {
      console.log(`not able to select tenantList of ${filter} from database`);
      callback(false);
    } else {
      console.log(`${filter} tenantList returned`);
      callback(tenantList);
    }
  });
}

// return a list of JSON contains all of the properties owned by user
function selectAllProperties(user_id, callback) {
  let sql = `SELECT * FROM property WHERE user_id = ?`;
  let inserts = [user_id];
  connection.query(sql, inserts, function (err, propertyList) {
    if (err) {
      console.log(`not able to select property of user_id: ${user_id} from database`);
      callback(false);
    } else {
      console.log(`user_id: ${user_id} property list returned`);
      callback(propertyList);
    }
  });
}
function selectProperty(property_id, callback) {
  let sql = `SELECT * FROM property WHERE property_id = ?`;
  let inserts = [property_id];
  connection.query(sql, inserts, function (err, propertyList) {
    if (err) {
      console.log(`not able to select property of property_id: ${property_id} from database`);
      callback(false);
    } else {
      console.log(`property_id: ${property_id} property list returned`);
      callback(propertyList);
    }
  });
}

// insert property info
// property_info is a JSON with name, address, property_type, total_footage, landlord_phone
// return true if it success
// return false if it failed
function insertProperty(user_id, property_info, callback) {
  let name = property_info.name;
  let address = property_info.address;
  let property_type = property_info.property_type;
  let total_footage = property_info.total_footage;
  let landlord_phone = property_info.landlord_phone;

  let sql = `INSERT INTO property(user_id,name,address,property_type, total_footage, landlord_phone) VALUES(?,?,?,?,?,?)`;
  let inserts = [user_id, name, address, property_type, total_footage, landlord_phone];

  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to add new property for user_id: ${user_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("added");
        callback(true);
      } else {
        console.log("error");
        callback(false);
      }
    }
  });
}

// update property info
// property_info is a JSON with name, address, property_type, total_footage, landlord phone
// return true if update successful
// return false if update failed
function updateProperty(user_id, property_info, callback) {
  let name = property_info.name;
  let address = property_info.address;
  let property_type = property_info.property_type;
  let total_footage = property_info.total_footage;
  let landlord_phone = property_info.landlord_phone;
  let property_id = property_info.property_id;

  let sql = `UPDATE property set name = ?, address = ?, property_type = ?, total_footage = ? , landlord_phone = ? WHERE user_id = ? AND property_id = ?`;
  let inserts = [name, address, property_type, total_footage, landlord_phone, user_id, property_id];

  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to update property info for user_id: ${user_id} property_id: ${property_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("updated!");
        callback(true);
      } else {
        console.log(`error! not able to update property info for user_id: ${user_id} property_id: ${property_id} into database`);
        callback(false);
      }
    }
  });
}

// delete property by property_id and user_id
// return true if delete successfully
// return false if delete fails
function deleteProperty(user_id, property_id, callback) {
  let sql = `DELETE FROM property WHERE property_id = ? AND user_id = ?`;
  let inserts = [property_id, user_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to delete property_id: ${property_id} user_id: ${user_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        callback(true);
      } else {
        console.log(`not able to delete property_id: ${property_id} user_id: ${user_id} from database`);
        callback(false);
      }
    }
  });
}

// add new meter to a property
// return true if adds successfully
// return false if adds failed
function insertMeter(meter_id, property_id, callback) {
  let sql = `INSERT INTO meter(property_id,meter_id) VALUES(?,?)`;
  let inserts = [property_id, meter_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to add meter_id: ${meter_id} for property_id: ${property_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("added");
        callback(true);
      } else {
        console.log("add new meter failed");
        callback(false);
      }
    }
  });
}

// delete meter info
// return true if adds successfully
// return false if adds failed
function deleteMeter(meter_id, property_id, callback) {
  let sql = `DELETE FROM meter WHERE property_id = ? AND meter_id = ?`;
  let inserts = [property_id, meter_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to delete property_id: ${property_id} meter_id: ${meter_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        callback(true);
      } else {
        console.log(`not able to delete property_id: ${property_id} user_id: ${meter_id} from database`);
        callback(false);
      }
    }
  });
}

// return a list of JSON contains meter list of a property
function selectAllMeters(property_id, callback) {
  let sql = `SELECT * FROM meter WHERE property_id = ?`;
  let inserts = [property_id];
  connection.query(sql, inserts, function (err, meterList) {
    if (err) {
      console.log(`not able to select meterList of property_id: ${property_id} from database`);
      callback(false);
    } else {
      console.log(`property_id: ${property_id} meter list returned`);
      callback(meterList);
    }
  });
}

// add a submeter for a tenant
// submeter_info is a JSON contains submeter_id, tenant_id, meter_id, multiplier
// return true if adds successfully
// return false if adds failed
function insertSubmeter(submeter_info, callback) {
  let submeter_id = submeter_info.submeter_id;
  let tenant_id = submeter_info.tenant_id;
  let meter_id = submeter_info.meter_id;
  let multiplier = submeter_info.multiplier;
  let sql = `INSERT INTO submeter(submeter_id, tenant_id, meter_id, multiplier) VALUES(?,?,?,?)`;
  let inserts = [submeter_id, tenant_id, meter_id, multiplier];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to add submeter_id: ${submeter_id} for tenant_id: ${tenant_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("added");
        callback(true);
      } else {
        console.log("add new submeter failed");
        callback(false);
      }
    }
  });
}

// update submeter info
// update_info is a JSON contains tenant_id, meter_id, multiplier
// return true if update successfully
// return false if update failed
function updateSubmeter(submeter_id, update_info, callback) {
  let tenant_id = update_info.tenant_id;
  let meter_id = update_info.meter_id;
  let multiplier = update_info.multiplier;

  let sql = `UPDATE tenant SET tenant_id = ?, meter_id = ?, multiplier = ? WHERE submeter_id = ?`;
  let inserts = [tenant_id, meter_id, multiplier, submeter_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to update submeter_id: ${submeter_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("updated");
        callback(true);
      } else {
        console.log(`update submeter_id: ${submeter_id} failed`);
        callback(false);
      }
    }
  });
}

// delete a Submeter for a tenant
// return true if deletes successfully
// return false if deletes failed
function deleteSubmeter(tenant_id, submeter_id, callback) {
  let sql = `DELETE FROM submeter WHERE tenant_id = ? AND submeter_id = ?`;
  let inserts = [tenant_id, submeter_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to delete tenant_id: ${tenant_id} submeter_id: ${submeter_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        callback(true);
      } else {
        console.log(`not able to delete tenant_id: ${tenant_id} submeter_id: ${submeter_id} from database`);
        callback(false);
      }
    }
  });
}

// return a list of JSON contains Submeter list of a tenant
function selectAllSubmeters(tenant_id, callback) {
  let sql = `SELECT * FROM submeter WHERE tenant_id = ?`;
  let inserts = [tenant_id];
  connection.query(sql, inserts, function (err, submeterList) {
    if (err) {
      console.log(`not able to select submeterList of tenant_id: ${tenant_id} from database`);
      callback(false);
    } else {
      console.log(`tenant_id: ${tenant_id} meter list returned`);
      callback(submeterList);
    }
  });
}

// // filter is a JSON with an list of filter wants to apply when query submeter table
// // return a list of JSON
function selectSubmeter(filter, callback) {
  let sql = `SELECT * FROM submeter WHERE `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = ${filter[key]}`;
    } else {
      sql += `${key} = ${filter[key]} AND `;
    }
  });
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(`not able to select list of ${filter} from database`);
      callback(false);
    } else {
      console.log(`${filter} List returned`);
      callback(result);
    }
  });
}

// insert new bill
// bill_info is a json with account_id, meter_id, m_kwh_usage(national grid),
// from_date, to_date, m_charge(national grid), s_kwh_usage(constellation), s_charge(constellation),
// total_kwh_usage, total_charge, unit_charge
// return true if insert successfully
// return false if insert failed
function insertBill(bill_info, callback) {
  let account_id = bill_info.account_id;
  let meter_id = bill_info.meter_id;
  let m_kwh_usage = bill_info.m_kwh_usage;
  let from_date = bill_info.from_date;
  let to_date = bill_info.to_date;
  let m_charge = bill_info.m_charge;
  let s_kwh_usage = bill_info.s_kwh_usage;
  let s_charge = bill_info.s_charge;
  let total_kwh_usage = bill_info.total_kwh_usage;
  let total_charge = bill_info.total_charge;
  let unit_charge = bill_info.unit_charge;

  let sql = `INSERT INTO bill(account_id,meter_id,m_kwh_usage,from_date, to_date,m_charge,s_kwh_usage,s_charge,total_kwh_usage,total_charge,unit_charge) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
  let inserts = [account_id, meter_id, m_kwh_usage, from_date, to_date, m_charge, s_kwh_usage, s_charge, total_kwh_usage, total_charge, unit_charge];

  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to add new bill account_id: ${account_id} meter_id: ${meter_id} from_date: ${from_date} to_date: ${to_date} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("added");
        callback(true);
      } else {
        console.log("error");
        callback(false);
      }
    }
  });
}

// update bill
// bill_info is a json with account_id, meter_id, m_kwh_usage(national grid),
// from_date, to_date, m_charge(national grid), s_kwh_usage(constellation), s_charge(constellation),
// total_kwh_usage, total_charge, unit_charge
// return true if update successfully
// return false if update failed
function updateBill(bill_id, bill_info, callback) {
  let account_id = bill_info.account_id;
  let meter_id = bill_info.meter_id;
  let m_kwh_usage = bill_info.m_kwh_usage;
  let from_date = bill_info.from_date;
  let to_date = bill_info.to_date;
  let m_charge = bill_info.m_charge;
  let s_kwh_usage = bill_info.s_kwh_usage;
  let s_charge = bill_info.s_charge;
  let total_kwh_usage = bill_info.total_kwh_usage;
  let total_charge = bill_info.total_charge;
  let unit_charge = bill_info.unit_charge;

  let sql = `UPDATE bill set account_id = ?, meter_id = ?, m_kwh_usage = ?, from_date = ?, to_date = ?,m_charge = ?,s_kwh_usage = ?,s_charge = ?,total_kwh_usage = ?,total_charge = ?,unit_charge = ? WHERE bill_id = ?`;
  let inserts = [account_id, meter_id, m_kwh_usage, from_date, to_date, m_charge, s_kwh_usage, s_charge, total_kwh_usage, total_charge, unit_charge, bill_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to update bill info for bill_id: ${bill_id}  into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("updated!");
        callback(true);
      } else {
        console.log(`error! not able to update bill info for bill_id: ${bill_id} into database`);
        callback(false);
      }
    }
  });
}

// delete bill
// return true if delete successfully
// return false if delete failed
function deleteBill(bill_id, callback) {
  let sql = `DELETE FROM bill WHERE bill_id = ?`;
  let inserts = [bill_id];
  console.log("bbbb", bill_id);
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to delete bill_id: ${bill_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        callback(true);
      } else {
        console.log(`not able to delete bill_id: ${bill_id} from database`);
        callback(false);
      }
    }
  });
}

// filter is a JSON with an list of filter wants to apply when query bill table
// return a list of JSON contains bill list
function selectBill(filter, callback) {
  let sql = `SELECT * FROM bill WHERE `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = ${filter[key]}`;
    } else {
      sql += `${key} = ${filter[key]} AND `;
    }
  });
  console.log("sql:", sql);
  connection.query(sql, function (err, billList) {
    if (err) {
      console.log(`not able to select billList of ${filter} from database`);
      callback(false);
    } else {
      console.log(`${filter} billList returned`);
      callback(billList);
      console.log("SSSSS:", billList);
    }
  });
}

// insert submeter_bill
// submeter_bill_info is a JSON contains bill_id, submeter_id, prior_read, cur_read, from_date, to_date, cur_amt, amt_with_multiplier, amt_due
// return true if insert successfully
// return false if insert failed
function insertSubmeterBill(submeter_bill_info, callback) {
  let bill_id = submeter_bill_info.bill_id;
  let submeter_id = submeter_bill_info.submeter_id;
  let prior_read = submeter_bill_info.prior_read;
  let cur_read = submeter_bill_info.cur_read;
  let from_date = submeter_bill_info.from_date;
  let to_date = submeter_bill_info.to_date;
  let cur_amt = submeter_bill_info.s_kwh_usage;
  let amt_with_multiplier = submeter_bill_info.amt_with_multiplier;
  let amt_due = submeter_bill_info.amt_due;

  let sql = `INSERT INTO submeter_bill(bill_id, submeter_id, prior_read, cur_read, from_date, to_date, cur_amt, amt_with_multiplier, amt_due) VALUES(?,?,?,?,?,?,?,?,?)`;
  let inserts = [bill_id, submeter_id, prior_read, cur_read, from_date, to_date, cur_amt, amt_with_multiplier, amt_due];

  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to add new submeter_bill for submeter_id: ${submeter_id} from_date: ${from_date} to_date: ${to_date} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("inserted");
        callback(true);
      } else {
        console.log(`not able to add new submeter_bill for account_id: ${account_id} from_date: ${from_date} to_date: ${to_date} into database`);
        callback(false);
      }
    }
  });
}

// update submeter_bill
// updated_info is a JSON contains bill_id, submeter_id, prior_read, cur_read, from_date, to_date, cur_amt, amt_with_multiplier, amt_due
// return true if update successfully
// return false if update failed
function updateSubmeterBill(submeter_bill_id, updated_info, callback) {
  let bill_id = updated_info.bill_id;
  let submeter_id = updated_info.submeter_id;
  let prior_read = updated_info.prior_read;
  let cur_read = updated_info.cur_read;
  let from_date = updated_info.from_date;
  let to_date = updated_info.to_date;
  let cur_amt = updated_info.s_kwh_usage;
  let amt_with_multiplier = updated_info.amt_with_multiplier;
  let amt_due = updated_info.amt_due;

  let sql = `UPDATE submeter_bill SET bill_id = ?, submeter_id = ?, prior_read = ?, cur_read = ?,from_date = ?,to_date = ?,cur_amt = ?,amt_with_multiplier = ?,amt_due = ? WHERE submeter_bill_id = ?`;
  let inserts = [bill_id, submeter_id, prior_read, cur_read, from_date, to_date, cur_amt, amt_with_multiplier, amt_due, submeter_bill_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to update submeter_bill info for submeter_bill_id: ${submeter_bill_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("updated!");
        callback(true);
      } else {
        console.log(`not able to update submeter_bill info for submeter_bill_id: ${submeter_bill_id} into database`);
        callback(false);
      }
    }
  });
}

// delete submeter_bill
// return true if delete successfully
// return false if delete failed
function deleteSubmeterBill(submeter_bill_id, callback) {
  let sql = `DELETE FROM submeter_bill WHERE submeter_bill_id = ?`;
  let inserts = [submeter_bill_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to delete submeter_bill_id: ${submeter_bill_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log(`submeter_bill_id: ${submeter_bill_id} deleted!`);
        callback(true);
      } else {
        console.log(`not able to delete submeter_bill_id: ${submeter_bill_id} from database`);
        callback(false);
      }
    }
  });
}

// filter is a JSON with an list of filter wants to apply when query submeter_bill table
// return a list of JSON contains submeter_bill list
function selectSubmeterBill(filter, callback) {
  let sql = `SELECT * FROM submeter_bill WHERE `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = ${filter[key]}`;
    } else {
      sql += `${key} = ${filter[key]} AND `;
    }
  });
  connection.query(sql, function (err, submeterBillList) {
    if (err) {
      console.log(`not able to select billList of ${filter} from database`);
      callback(false);
    } else {
      console.log(`${filter} billList returned`);
      callback(submeterBillList);
    }
  });
}

// insert new invoice
// invoice_info is a JSON contains tenant_id, from_date, to_date, prior_read, cur_read, rubs, has_submeter, submeter_id, unit_charge, total_charge
// return true if insert successfully
// return false if insert failed
function insertInvoice(invoice_info, callback) {
  let tenant_id = invoice_info.tenant_id;
  let from_date = invoice_info.from_date;
  let to_date = invoice_info.to_date;
  let prior_read = invoice_info.prior_read;
  let cur_read = invoice_info.cur_read;
  let rubs = invoice_info.rubs;
  let has_submeter = invoice_info.has_submeter;
  let submeter_id = invoice_info.submeter_id;
  let unit_charge = invoice_info.unit_charge;
  let total_charge = invoice_info.total_charge;

  let submeter_charge = invoice_info.submeter_charge;
  let multiplier = invoice_info.multiplier;
  let meter_amt_due = invoice_info.meter_amt_due;
  let meter_id = invoice_info.meter_id;

  let sql = `INSERT INTO invoice(tenant_id, from_date, to_date, prior_read, cur_read, rubs, 
    has_submeter, submeter_id, unit_charge, total_charge, submeter_charge, multiplier, meter_amt_due, meter_id) 
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  let inserts = [tenant_id, from_date, to_date, prior_read, cur_read, rubs, has_submeter, submeter_id, unit_charge, total_charge, submeter_charge, multiplier, meter_amt_due, meter_id];

  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to add new invoice for tenant_id: ${tenant_id} from_date: ${from_date} to_date: ${to_date} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("added");
        callback(true);
      } else {
        console.log(`not able to add new invoice for tenant_id: ${tenant_id} from_date: ${from_date} to_date: ${to_date} into database`);
        callback(false);
      }
    }
  });
}

// update invoice
// updated_info is a JSON contains tenant_id, from_date, to_date, prior_read, cur_read, rubs, has_submeter, submeter_id, unit_charge, total_charge
// return true if update successfully
// return false if update failed
function updateInvoice(invoice_id, updated_info, callback) {
  let tenant_id = updated_info.tenant_id;
  let from_date = updated_info.from_date;
  let to_date = updated_info.to_date;
  let prior_read = updated_info.prior_read;
  let cur_read = updated_info.cur_read;
  let rubs = updated_info.rubs;
  let has_submeter = updated_info.has_submeter;
  let submeter_id = updated_info.submeter_id;
  let unit_charge = updated_info.unit_charge;
  let total_charge = updated_info.total_charge;

  let sql = `UPDATE invoice SET tenant_id = ?, from_date = ?, to_date = ?, prior_read = ?, cur_read = ?, rubs = ?, has_submeter = ?, submeter_id = ?, unit_charge = ?, total_charge = ? WHERE invoice_id = ?`;
  let inserts = [tenant_id, from_date, to_date, prior_read, cur_read, rubs, has_submeter, submeter_id, unit_charge, total_charge, invoice_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to update invoice info for invoice_id: ${invoice_id}  into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("updated!");
        callback(true);
      } else {
        console.log(`not able to update invoice info for invoice_id: ${invoice_id}  into database`);
        callback(false);
      }
    }
  });
}

// delete invoice
// return true if delete successfully
// return false if delete failed
function deleteInvoice(invoice_id, callback) {
  let sql = `DELETE FROM invoice WHERE invoice_id = ?`;
  let inserts = [invoice_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to delete invoice_id: ${invoice_id} from database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log(`invoice_id: ${invoice_id} deleted!`);
        callback(true);
      } else {
        console.log(`not able to delete invoice_id: ${invoice_id} from database`);
        callback(false);
      }
    }
  });
}
function TimePeriod_Invoice(filter, callback) {
  let sql = `SELECT distinct from_date, to_date FROM invoice WHERE `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = "${filter[key]}"`;
    } else {
      if (key == "tenant_id") {
        sql += `${key} in (${filter[key]}) AND `;
      } else {
        sql += `${key} = "${filter[key]}" AND `;
      }
    }
  });
  console.log("new sql:", sql);
  connection.query(sql, function (err, time_list) {
    if (err) {
      console.log(`not able to select time_list of ${filter} from database`);
      callback(false);
    } else {
      console.log(`${filter} time_list returned`);
      callback(time_list);
    }
  });
}

// filter is a JSON with an list of filter wants to apply when query invoice table
// return a list of JSON contains invoice list
function selectInvoice(filter, callback) {
  let sql = `SELECT * FROM invoice WHERE `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = "${filter[key]}"`;
    } else {
      if (key == "tenant_id") {
        sql += `${key} in (${filter[key]}) AND `;
      } else {
        sql += `${key} = "${filter[key]}" AND `;
      }
    }
  });
  console.log("new sql:", sql);
  connection.query(sql, function (err, invoiceList) {
    if (err) {
      console.log(`not able to select billList of ${filter} from database`);
      callback(false);
    } else {
      console.log(`${filter} billList returned`);
      callback(invoiceList);
    }
  });
}

// associate meter with tenant
// return true if add successfully
// return false if add failed
function associateMeterWithTenant(meter_id, tenant_id, callback) {
  let sql = `INSERT INTO meter_tenant(meter_id, tenant_id) VALUES(?,?)`;
  let inserts = [meter_id, tenant_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(`not able to add meter_id: ${meter_id} for tenant_id: ${tenant_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("added");
        callback(true);
      } else {
        console.log(`not able to add meter_id: ${meter_id} for tenant_id: ${tenant_id} into database`);
        callback(false);
      }
    }
  });
}

// delete meter_tenant
// return true if delete successfully
// return false if delete failed
function deleteMeterTenantRelation(meter_id, tenant_id, callback) {
  let sql = `DELETE FROM meter_tenant WHERE meter_id = ? AND tenant_id = ?`;
  let inserts = [meter_id, tenant_id];
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      console.log(err);
      console.log(`not able to delete meter_id: ${meter_id} for tenant_id: ${tenant_id} into database`);
      callback(false);
    } else {
      if (result.affectedRows == 1) {
        console.log("deleted!");
        callback(true);
      } else {
        console.log(`not able to delete meter_id: ${meter_id} for tenant_id: ${tenant_id} into database`);
        callback(false);
      }
    }
  });
}
//delete all meter tenant relation
function deleteAllMeterTenantRelation(tenant_id, callback) {
  let sql = `DELETE FROM meter_tenant WHERE tenant_id = ?`;
  let inserts = [tenant_id];
  console.log(sql);
  connection.query(sql, inserts, function (err, result) {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
}

// this function will return a list of meter-tenant relations existed in given property_id
function selectMeterTenantListByProperty(property_id, callback) {
  let sql = `
        select
            meter.meter_id,
            meter_tenant.tenant_id
        from
            meter inner join meter_tenant on meter.meter_id = meter_tenant.meter_id
        where meter.property_id = ?
        order by meter.meter_id`;
  let inserts = [property_id];
  connection.query(sql, inserts, function (err, meterTenantList) {
    if (err) {
      console.log(`not able to select meterTenantList of property_id: ${property_id} from database`);
      callback(false);
    } else {
      console.log(`property_id: ${property_id} meterTenantList list returned`);
      callback(meterTenantList);
    }
  });
}

// this function will return a list of meter-submeter bill by property_id and given time period
function selectMeterSubmeterBillByProperty(property_id, from_date, to_date, callback) {
  let sql = `
      with meter_list as
        (
          select meter_id from meter where property_id = ?
        )
      select * from meter_list, bill inner join submeter_bill on bill.bill_id = submeter_bill.bill_id
      where meter_list.meter_id = bill.meter_id and bill.from_date >= ? and bill.to_date <= ? `;
  let inserts = [property_id, from_date, to_date];

  connection.query(sql, inserts, function (err, meterSubmeterBillList) {
    if (err) {
      console.log(`not able to select meterSubmeterBillList of property_id: ${property_id} between ${from_date} and ${to_date} from database`);
      callback(false);
    } else {
      console.log(`property_id: ${property_id} between ${from_date} and ${to_date} meterSubmeterBillList returned`);
      callback(meterSubmeterBillList);
    }
  });
}

// this function will return a list of property_id, meter_id, submeter_id, bill_id, submeter_bill_id, from_date, to_date
// filter is a Json
function selectBillInfoAssociateWithProperty(filter, callback) {
  let sql = `
      with prepared_table as (
        select m.property_id, m.meter_id, s.submeter_id, b.bill_id, s.submeter_bill_id, b.from_date, b.to_date
        from ((meter m left join bill b on b.meter_id=m.meter_id) left join submeter_bill s on s.bill_id=b.bill_id)
      )
      select * from prepared_table where `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = ${filter[key]}`;
    } else {
      sql += `${key} = ${filter[key]} AND `;
    }
  });
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(`not able to select List of ${filter} from database`);
      callback(false);
    } else {
      console.log(`${filter} List returned`);
      callback(result);
    }
  });
}

// this function will return a list of meter_id and submeter_id associate with given property
function selectAllMetersSubmetersByProperty(property_id, callback) {
  let sql = `
      with meter_list as(
        select meter_id from meter where property_id = ?
      )
      select submeter_id, meter_list.meter_id, tenant_id, multiplier
      from submeter,meter_list
      where submeter.meter_id = meter_list.meter_id`;
  let inserts = [property_id];
  connection.query(sql, inserts, function (err, meterSubmeterList) {
    if (err) {
      console.log(`not able to select meterSubmeterList of property_id: ${property_id} from database`);
      callback(false);
    } else {
      console.log(`property_id: ${property_id} meterSubmeterList returned`);
      callback(meterSubmeterList);
    }
  });
}

// this function will allow to filter bill by property_id and all fields in bill
function selectBillWithProperty(filter, callback) {
  let sql = `select * from meter left join bill on meter.meter_id = bill.meter_id WHERE `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = "${filter[key]}"`;
    } else {
      sql += `${key} = "${filter[key]}" AND `;
    }
  });
  console.log(sql);
  connection.query(sql, function (err, invoiceList) {
    if (err) {
      console.log(`not able to select billList of ${filter} from database`);
      callback(false);
    } else {
      console.log(`${filter} billList returned`);
      callback(invoiceList);
      console.log("invoiceList", invoiceList);
    }
  });
}

//use this function to get all avaiable time period for certain property
function selectAllTime_WithProperty(filter, callback) {
  let sql = `select distinct from_date, to_date from meter left join bill on meter.meter_id = bill.meter_id WHERE `;
  let keys = Object.keys(filter);
  keys.forEach(function (key, index) {
    if (index + 1 == keys.length) {
      sql += `${key} = "${filter[key]}"`;
    } else {
      sql += `${key} = "${filter[key]}" AND `;
    }
  });
  console.log(sql);
  connection.query(sql, function (err, time_list) {
    if (err) {
      callback(false);
    } else {
      callback(time_list);
    }
  });
}

exports.establishDatabaseConnection = establishDatabaseConnection;
exports.connection = connection;

exports.insertUserId = insertUserId;
exports.deleteUserId = deleteUserId;

exports.selectAllTenants = selectAllTenants;
exports.insertTenant = insertTenant;
exports.updateTenant = updateTenant;
exports.deleteTenant = deleteTenant;
exports.selectTenant = selectTenant;

exports.selectAllProperties = selectAllProperties;
exports.insertProperty = insertProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
exports.selectProperty = selectProperty;

exports.selectAllMeters = selectAllMeters;
exports.insertMeter = insertMeter;
exports.deleteMeter = deleteMeter;

exports.associateMeterWithTenant = associateMeterWithTenant;
exports.deleteMeterTenantRelation = deleteMeterTenantRelation;
exports.deleteAllMeterTenantRelation = deleteAllMeterTenantRelation;

exports.selectAllSubmeters = selectAllSubmeters;
exports.insertSubmeter = insertSubmeter;
exports.updateSubmeter = updateSubmeter;
exports.deleteSubmeter = deleteSubmeter;
exports.selectSubmeter = selectSubmeter;

exports.insertBill = insertBill;
exports.updateBill = updateBill;
exports.deleteBill = deleteBill;
exports.selectBill = selectBill;

exports.insertSubmeterBill = insertSubmeterBill;
exports.updateSubmeterBill = updateSubmeterBill;
exports.deleteSubmeterBill = deleteSubmeterBill;
exports.selectSubmeterBill = selectSubmeterBill;

exports.insertInvoice = insertInvoice;
exports.updateInvoice = updateInvoice;
exports.deleteInvoice = deleteInvoice;
exports.selectInvoice = selectInvoice;
exports.TimePeriod_Invoice = TimePeriod_Invoice;

exports.selectMeterTenantListByProperty = selectMeterTenantListByProperty;
exports.selectMeterSubmeterBillByProperty = selectMeterSubmeterBillByProperty;
exports.selectAllMetersSubmetersByProperty = selectAllMetersSubmetersByProperty;
exports.selectBillInfoAssociateWithProperty = selectBillInfoAssociateWithProperty;
exports.selectBillWithProperty = selectBillWithProperty;
exports.selectAllTime_WithProperty = selectAllTime_WithProperty;
