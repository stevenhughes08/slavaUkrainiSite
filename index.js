const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();


// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // handels URL encoded data
// end parser middlware


// custom middleware to log data access 
const log = function(request, response, next) {
    console.log(`${new Date()}: ${request.protocol}://${request.get('host')}${request.originalUrl}`);
    console.log(request.body); //make sure JSON middleware is loaded before this line
    next();
}
app.use(log);
// end custom middleware

// enable static files pointing to the folder 'public'
// this can be used to serve the index.html file 
app.use(express.static(path.join(__dirname, "public")));

// HTTP POST 
app.post("/ajax/email", function(request, response) { //used to send email 
    // create reusable transporter object using the defalt SMTP transport 
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "slavaukrainie.int@gmail.com", //change this to access different gmail
            pass: "ldruhgbumxueogko"
        }
    });

    var textBody = `
    FROM: ${request.body.name} 
    EMAIL: ${request.body.email} 
    MESSAGE: ${request.body.message}`;

    var htmlBody = `
    <h2>Mail From Website Contact Form</h2>
    <p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p>
    <p>${request.body.message}</p>`;

    var mail = {
        from: "stevenhughes08@gmail.com", //senders address later replace with value from textbox
        to: "tatyana.malkin@gmail.com, slavaukrainie.int@gmail.com", // email being sent to 
        subject: "Mail from Website Contact Form", // goes in subject line 
        text: textBody,
        html: htmlBody
    }

    // send mail with defined transport object 
    transporter.sendMail(mail, function(err, info) {
        if (err) {
            console.log(err);
            response.json({ message: "message not set: an error occured; check the server's console log" });
        } else {
            response.json({ message: `Your message has been sent. We will get back to you as we can.` });
        }
    });
});

// set port from enviroment variable, or 8000
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));