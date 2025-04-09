




// Import the Brevo SDK
const brevo = require('@getbrevo/brevo');

// Set your API key
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey,process.env.BREVO_API);

// Define email details
const sender = {
  email: 'tarekanwer2345@gmail.com', // Sender's email address
  name: 'Your Name', // Sender's name
};

const receivers = [
  {
    email: 'tarekanwer23@yahoo.com', // Recipient's email address
  },
];

const emailContent = {
  subject: 'Hello from Brevo 5!', // Email subject
  htmlContent: '<p>This is a test email sent from Brevo using Node.js.</p>', // Email body (HTML)
  textContent: 'This is a test email sent from Brevo using Node.js.', // Email body (plain text)
};

// Send the email
apiInstance.sendTransacEmail({
  sender,
  to: receivers,
  ...emailContent,
})
  .then((response) => {
    console.log('Email sent successfully!', response);
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });