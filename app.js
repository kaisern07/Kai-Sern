const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
//const MailTime = require('mail-time');
const directTransport = require('nodemailer-direct-transport');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/send', (req, res) => {
  const output = `
    <h3>This is a Sample enrollment email </h3>
    <p>Your enroll information:</p>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
      <li>ID: ${req.body.id}</li>
    </ul>
    <h3>Thank you !</h3>
  `;
   
const transports = [];
const directTransportOpts = {
  pool: true,
  direct: true, 
  name: 'mail.example.com',
  maxConnections: 5,
  ratelimit: 5,
  };
transports.push(nodemailer.createTransport(directTransport(directTransportOpts)));
transports.push[0].options = directTransportOpts;

// Private SMTP
transports.push(nodemailer.createTransport({
host: 'smtp.example.com',
auth: {
    user: 'no-reply',
    pass: 'xxx'
  },
  }));

// Hotmail SMTP
transports.push(nodemailer.createTransport({
host: 'smtp.live.com',
port: 587, 
secure : false, // true for 465, false for other ports
auth: {
    user: 'no-reply@mail.example.com',
    pass: 'xxx'
  },
}));

// third party Mailing service (SparkPost as example)
transports.push(nodemailer.createTransport({
host: 'smtp.sparkpostmail.com',
port: 587,
auth: {
    user: 'SMTP_Injection',
    pass: 'xxx'
  },
}));

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"YOUR NAME" <your@email.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Confirmation Email', // Subject line
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log("The message was sent!");   
      console.log(info); //return message ID and status in console

      res.render('form', {msg:'Email has been sent successfully !'});
  });
  });

app.listen(3000, () => console.log('Server started...'));