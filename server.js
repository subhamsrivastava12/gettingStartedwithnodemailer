const express = require('express');
const bodyParser = require('body-parser');
const path =require('path');
const nodemailer=require('nodemailer');
const dotenv = require('dotenv');
const app=express();
dotenv.config();

const PORT=process.env.PORT||3000;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.get('/*',(req,res)=>{
    res.send("You can make a post request using this url for using the Email service");
});

app.post('/*',(req,res)=>{
    const receiver=req.body.to;
    const content=req.body.email_body;
    const output =
    `<p>You have received a email</p>
     <p>From : ${receiver}</p>
     <p>${content}</p>
    `

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    });

    let message = {
        from: ' "Nodemailer" <antoinette.graham81@ethereal.email>',
        to: receiver,
        subject: 'Nodemailer email service',
        text: content,
        html: output
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            const data={"success":false,
                        "message":err.message}
            console.log('Error occurred. ' + err.message);
            res.json(data);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log(message);

        const data={"success":true,
                    "message":"Email sent successfully"}
        res.json(data);
    });


})



app.listen(PORT,()=>{
    console.log("Server is running");
})