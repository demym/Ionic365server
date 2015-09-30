var nodemailer = require("nodemailer");
var nsmtptransport = require('nodemailer-smtp-transport');

// create reusable transport method (opens pool of SMTP connections)

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "demym13@gmail.com",
        pass: "Ser01glr"
    }
});

var smtpTransportIBM = nodemailer.createTransport('SMTP', {
    host: 'emea.relay.ibm.com',   //emea.relay.ibm.com
    port: 25,
    auth: {
        user: '',
        pass: ''
    }
});



// setup e-mail data with unicode symbols
var mailOptions = {
    from: "nodemailer on mail.js", // sender address
    to: "demym@yahoo.it", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
}

// send mail with defined transport object
function sendMail(mailobj,callback)
{
  var retvalue={};
  smtpTransport.sendMail(mailobj, function(error, response){
    if(error){
        console.log(error);
		retvalue={ success: "false","error":error.message};
    }else{
        console.log("Message sent: " + response.message);
		retvalue={ success: "true","ok":"mail sent correctly to "+mailobj.to};
    }
	callback(retvalue);

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
 });


}

function sendIbmMail(mailobj,callback)
{
 
	
	
  var retvalue={};
  smtpTransportIBM.sendMail(mailobj, function(error, response){
    if(error){
        console.log(error);
		retvalue={ success: "false","error":error.message};
    }else{
        console.log("Message sent: " + response.message);
		retvalue={ success: "true","ok":"mail sent correctly to "+mailobj.to};
    }
	callback(retvalue);

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
 });


}



exports.sendIbmMail=sendIbmMail;
exports.sendMail=sendMail;