import cron from 'node-cron';
import { User } from '../models/userSchema.js';
import { Application } from '../models/applicationSchema.js';
import nodemailer from 'nodemailer';

export const HandleApplyNow = async (req, res) => {
  try {
    console.log(req.body)
    const { user_id , job_title} = req.body;

    const user = await User.findById(user_id);
    const email = user.email;

    const application = await Application.findOne({
        where: {
            email
        }
    })
    if (!application) {
      let cronJ= cron.schedule('*/2 * * * *', async () => {
        const application = await Application.findOne({
            email
        })
        if(application){
          console.log(application.employerID)
          cronJ.stop();
          return res.status(200).json({ message: 'User found.' });
        }
        


        if (!application) {
          console.log("Applicant not found!")
          sendMail(email,job_title);  // Code here
          cronJ.stop();
          return res.status(200).json({ message: 'User not found. Checking again in 1 minute.' });
        }
      });

      
    }

   
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function sendMail(email,job_title) {
  // Create a transporter using nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "sample@gmail.com",
      pass: "password",
    },
  });

  const mailOptions = {
    from: 'sample@gmail.com',
    to:email,
    subject: `Please complete the form for ${job_title}` ,
    text: `Your form for ${job_title} is not complete , Please complete it.Unfortunately, it seems that we have not yet received your submission. 
    
    To ensure that we have all the necessary information,could you please take a few moments to fill out the form at your earliest convenience `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
