const axios = require('axios');
const https = require('https');
const aws = require('aws-sdk');
require('dotenv').config();

const {checkParamsVals} = require("./CheckdataFunction")
// const s3 = new AWS.S3();
const eotGatewayUrl = process.env.BASEURL;

const eotHeaders = {'content-type': 'application/json','Authorization':process.env.AUTH}

exports.SetAuthString =(authString) =>{
    global.eotHeaders['Authorization'] = authString;
    console.log(JSON.stringify(global.eotHeaders));
}



exports.CreateGroupByQuery = async (GroupName, queryValue) => {
    try {
      // console.log("hello it's run",GroupName,queryValue);
      const tagGroupName = GroupName;
      const tagNames = queryValue;
  
      const payload = {
        msgMethod: "RegisterGroupReq",
        tagGroupName,
        tagNames,
      };
      const config = {
        headers: eotHeaders,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      };
      const response = await axios.post(eotGatewayUrl, payload, config);
      // console.log(response.data,"rd"); 
      return response.data
    } catch (error) {

      console.log(error,"error")
    }
  };
  

  exports.DeleteGroupReq = async (GroupName) => {
    // console.log("hello delete", GroupName)
    try {
      const tagGroupName = GroupName;
      const payload = {
        msgMethod: "DeleteGroupReq",
        tagGroupName,
      };
      const config = {
        headers: eotHeaders,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      };
      const response = await axios.post(eotGatewayUrl, payload, config);
    //  console.log(response.data,"rd2DeleteGroupReq");
     return response.data
    } catch (error) {
      console.log(error,"err");
    }
  };

  exports.GetRecordedVals = async (tagGroupName, fromDateTime="", toDateTime="", kind="", targetType="", info0="", info1="", info2="", addonToValues="") => {
    const checkObj = {
        tagGroupName, fromDateTime,toDateTime,targetType,info0,info2,addonToValues
    }
    
    const  checkNodeObj = {
      tagGroupName,
      fromDateTime,
      toDateTime,
    };

    let check = await checkParamsVals(targetType ? checkObj :checkNodeObj )
    if(check.message === "true"){
    try {
        const payload = {
            msgMethod: "GetRecordedVals",
            tagGroupName,
            fromDateTime,
            toDateTime,
            kind,
            type: targetType,
            info0,
            info1,
            info2,
            addonToValues
          };
          
      const config = {
        headers: eotHeaders,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      };
      const response = await axios.post(eotGatewayUrl, payload, config);
    //  console.log( response.data,"GetRecordedVals");
        return response.data
        } catch (error) {
          console.log(error,"err");
        }
    }  
    else{
    return check.message
    }
  };

  
  