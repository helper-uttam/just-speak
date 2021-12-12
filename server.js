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


const send1 = (usermail, title, body) => {
  const SECRET_KEY = `${process.env.SENDGRID_API_KEY}`;
  sgMail.setApiKey(SECRET_KEY);
  const mail = String(process.env.MAIL);
  try {
    if(title.trim().length > 0 && body.trim().length > 10){
      sgMail.send({
        to: usermail,
        from: mail,
        subject: title,
        text: body
    });
    }
    else{
      alert('Enter more text');        
    }
  } catch (error) {
    console.log(error);
  }
  
}

let data = '';
let enteredTitle= '';
let enteredBody = '';

app.post("/", (req, res)=>{
const fetchData = async () => {
const url = "https://hospitals-ecf29-default-rtdb.firebaseio.com/notes.json";
https.get(url, res => {
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      data = JSON.parse(data);
      var result = Object.keys(data).map((key) => [Number(key), data[key]]);
      result = result[result.length-1][1];
      console.log(result);
      enteredTitle = result.title;
      enteredBody = result.body;
      console.log("title : " + enteredTitle);
      console.log("body : " + enteredBody);
    });
    res.on('end', () => {
      try {
        const email = req.body.email;
        send1(email.toString('base64'), enteredTitle.toString('base64'), enteredBody.toString('base64'));
      } catch (error) {
        console.log(error);
      }
      });
  }).on('error', err => {
    console.log(err.message);
  });
  
};
if(req.body.email.toString() < 7 || !req.body.email.toString().includes('@')){
  let notFound = path.join(__dirname, '/', './public', 'notFound.html' );
  res.sendFile(notFound);
}else{
  let successFile = path.join(__dirname, '/', './public', 'success.html' );
  fetchData();
  res.sendFile(successFile);
}
});


app.listen(process.env.PORT || 3000, () => {
  if (process.env.PORT == undefined) {
    console.log("Server is up on the port 3000");
  }else{
    console.log(`Server is up on port ${process.env.port}`);
  }
})









