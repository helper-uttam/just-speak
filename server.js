require('dotenv').config();
const path = require('path');
const sgMail = require('@sendgrid/mail');
const https = require('https');

const express = require('express');
const app = express();

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get("/", (req, res)=>{
    let index = path.join(__dirname, '/', './public', 'index.html' );
    res.sendFile(index);
})


app.listen(process.env.PORT || 3000, () => {
  if (process.env.PORT == undefined) {
    console.log("Server is up on the port 3000");
  }else{
    console.log(`Server is up on port ${process.env.port}`);
  }
})









