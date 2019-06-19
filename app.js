const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');

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

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(smtpPool({
    host: 'smtp.YOURDOMAIN.com', //server name
    port: 587,  
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'YOUR EMAIL', //email account
        pass: 'YOUR PASSWORD' //email password
    },
    maxConnections: 5, // use up to 5 parallel connections
    
    maxMessages: 10, // do not send more than 10 messages per connection
    
    ratelimit: 5, // do not send more than 5 messages in a second
  
    tls:{
      rejectUnauthorized:false
        }
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
      console.log(info);

      res.render('form', {msg:'Email has been sent successfully !'});
  });
  });

app.listen(3000, () => console.log('Server started...'));