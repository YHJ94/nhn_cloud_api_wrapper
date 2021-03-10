// Requirements
var express = require('express');
var router = express.Router()
var axios = require('axios');
var engine = require('../toast_modules/wrapperEngine');
var fs = require('fs');

// UUID generator
const { v4: uuidv4 } = require('uuid');

// Empty check function
var isEmpty = function(value){ 
  // Block storage size exception
  if ( typeof value == 'number' && value == 0) {
    return false;
  }

  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){ 
    return true; 
  }else{ 
    return false; 
  } 
};

// Generate request ID and wirte to log file
var requestLog = function(req, message) {

  // Check requst log file
  fs.exists('reqLog.txt', function (exists) { 
    // If there is no file, create one
    if (!exists) {
      var file = 'reqLog.txt'; 
      fs.open(file, 'w', function (err, fd) { 
        if (err) throw err; 
      }
    )};
  });
  
  // Set request info
  var request_uuid = uuidv4();
  var req_path = req.path;
  var req_origin_ip = req.headers["x-forwarded-for"];
  var req_data = req.body;

  // send request log
  var log_data = {
    'request_uuid': request_uuid,
    'request_path': req_path,
    'request_origin_ip': req_origin_ip,
    'request_raw_data': req_data
  }
  
  // Write to file
  fs.open('reqLog.txt', 'a', function (err, id) {
    fs.write(id, JSON.stringify(log_data) + '\n', 'utf8', function (error) { 
      console.log('write end') 
    });
  });
  
}

router.get('/instance/blockstorage/usage', async (req, res) => {

  requestLog(req, 'Block storage usage request');
  
  // Header data for aquire access token
  var tenantId = req.headers.tenantid;
  var apiCredential = {
    username: req.headers.username,
    password: req.headers.apipassword
  }

  var job_response = await engine.instanceBlockStorageUsage(tenantId, apiCredential);
  
  // Failed
  if(!job_response.header.isSuccessful) {
    res.status(400);
  }
  
  res.json(job_response);
  
})

router.get('/testing', async (req, res) => {
  var result = await toast.testing();
  res.json(result);
})

module.exports = router