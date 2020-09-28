const express = require('express');
const tunnel = require('tunnel');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config()
const app = express()
const port = 3000
process.env.NODE_EXTRA_CA_CERTS = './config/sandbox.pem'

var cors = (function(req,res,next){
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
      } else {
        res.header('Access-Control-Allow-Origin', '*');
      }
    next();
});
app.use(cors)

app.post('/post', (req,res) => {
  res.send({'status':'Outbound connection successfully received!'})
});

app.get('/outbound', (req,res) => {
    const tunnelingAgent = tunnel.httpsOverHttp({
        ca: [ fs.readFileSync('./config/sandbox.pem')],
        proxy: {
            host: process.env.VGS_OUTBOUND_PROXY,
            port: '8080',
            proxyAuth: process.env.VGS_PROXY_AUTH
        }
    });
    console.log('Making outbound axios request via the VGS Outbound Proxy...')
    axios.post(
        'https://5e0478c0db8c.ngrok.io/post',
        {'test':'Value'},
        { 
          httpsAgent: tunnelingAgent, 
          proxy: false,
          headers: {
            'Content-Type':'application/json'
          }
      }).then((response) => {
        console.log(`Got response from Axios request:\n${JSON.stringify(response.data)}`)
        res.send(response.data)
      })

});  

app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
})
