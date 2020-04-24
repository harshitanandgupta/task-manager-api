const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);
const sendsignupmail=(email,name)=>{
    const msg = {
        to: email,
        from: 'rajdreambigkumar1@gmail.com',
        subject: 'Welcome to Task App',
        html: `<strong>Welcome ${name},Hope you have a Great Day and easy to do anywhere, even with Node.js</strong>`,
      };
      sgMail.send(msg)
}
const senddeletemail=(email,name)=>{
    const msg = {
        to: email,
        from: 'rajdreambigkumar1@gmail.com',
        subject: 'Sorry to See you go',
        html: `<strong>Bye ${name},Hope you have a Great Day and easy to do anywhere, even with Node.js</strong>`,
      };
      sgMail.send(msg).catch((error)=>{
          console.log(error)
      })
}

module.exports={
    sendsignupmail,
    senddeletemail
}