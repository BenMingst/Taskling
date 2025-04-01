import sgMail from '@sendgrid/mail';

sgMail.setApiKey("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");

const msg = {
  to: 'chris.y5@icloud.com',
  from: 'ch564584@ucf.edu', 
  subject: 'SendGrid Test Email',
  text: 'This is a test email from SendGrid.',
};

sgMail
  .send(msg)
  .then(() => console.log('Email sent successfully'))
  .catch((error) => console.error('SendGrid error:', error.response.body));