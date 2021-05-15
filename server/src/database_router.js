const express = require("express");
const router = express.Router();
const database = require("./database");
const email = require("./email");
const bodyParser = require("body-parser");
const cors = require("cors");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cors());

// The following commented code is for testing the connection between backend and database
// router.post('/testInsert',(req,res)=>{
//     const {user_id, category} = req.body;
//     console.log(`user_id: ${user_id},category: ${category}`);
//     database.connection.query(`INSERT into user (user_id, category) VALUES (${user_id}, ${category})`,function(err){
//         // check error type later
//         if(err) {
//             console.log('error found');
//             res.status(500).send('Sorry, we cannot find that!');
//         } else {
//             console.log('ok');
//             res.send('added');
//         }
//     });
// })

// The following commented code is for testing the prepared statement
// router.post('/testInsert',(req,res)=>{
//     const {user_id} = req.body;
//     console.log(req.body);
//     console.log(`user_id: ${user_id}`);
//     let sql = `INSERT INTO user (user_id) VALUES (?)`;
//     let inserts = [user_id];
//     database.connection.query(sql,inserts, function(err){
//         // check error type later
//         if(err) {
//             console.log('error found');
//             res.status(500).send('Sorry, we cannot find that!');
//         } else {
//             console.log('ok');
//             res.send('added');
//         }
//     });
// })

// The following commented code is for testing delete user
// router.post('/testDelete',(req,res)=>{
//     const {user_id} = req.body;
//     console.log(`user_id: ${user_id}`);
//     let sql = `DELETE FROM user WHERE ?? = ?`;
//     let inserts = ["user_id", user_id];
//     database.connection.query(sql,inserts, function(err){
//         // check error type later
//         if(err) {
//             console.log('error found');
//             res.status(500).send('Sorry, we cannot delete that!');
//         } else {
//             console.log('ok');
//             res.send('deleted');
//         }
//     });
// })

// testing email sender
// router.post('/testEmail',(req,res)=>{
//     const {receiver, content} = req.body;
//     console.log(`receiver: ${receiver},content: ${content}`);
//     email.sentEmail(receiver, content);
//     res.send("sent");
// })

// testing deleteProperty
// router.post('/testDeleteProperty',(req,res)=>{
//     const {property_id, user_id} = req.body;
//     console.log(`user_id: ${user_id}`);
//     console.log(`property_id: ${property_id}`);
//
//     let sql = `DELETE FROM property WHERE ?? = ? AND ?? = ?`;
//     let inserts = ["property_id", property_id, "user_id", user_id];
//     database.connection.query(sql,inserts, function(err){
//         // check error type later
//         if(err) {
//             console.log('error found');
//             res.status(500).send('Sorry, we cannot delete that!');
//         } else {
//             console.log('ok');
//             res.send('deleted');
//         }
//     });
// })

// testing selectAllProperties
// router.post('/testSelectAllProperties',(req,res)=>{
//     const {user_id} = req.body;
//     console.log(`user_id: ${user_id}`);
//     let sql = `SELECT * FROM property WHERE ?? = ?`;
//     let inserts = ["user_id",user_id];
//     database.connection.query(sql,inserts, function(err, result){
//         // check error type later
//         if(err) {
//             console.log('error found');
//             res.status(500).send('Sorry, we cannot found that!');
//         } else {
//             console.log('ok');
//             console.log(result);
//             res.send('returned');
//         }
//     });
// })

// testing selectMeterTenantListByProperty
// router.post('/testSelectMeterTenantListByProperty',(req,res)=>{
//     const {property_id} = req.body;
//     console.log(`property_id: ${property_id}`);
//     let sql = `
//         select
//             ??,
//             ??
//         from
//             ?? inner join ?? on ?? = ??
//         where ?? = ?
//         order by ??`;
//     let inserts = [
//         "meter.meter_id",
//         "meter_tenant.tenant_id",
//         "meter", "meter_tenant", "meter.meter_id", "meter_tenant.meter_id",
//         "meter.property_id", property_id,
//         "meter.meter_id"];
//     database.connection.query(sql,inserts, function(err, result){
//         // check error type later
//         if(err) {
//             console.log('error found');
//             res.status(500).send('Sorry, we cannot found that!');
//         } else {
//             console.log('ok');
//             console.log(result);
//             res.send('returned');
//         }
//     });
// })

module.exports = router;
