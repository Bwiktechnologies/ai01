const { sendWelcomeEmail } = require('./services/sendgrid');

async function test() {
  try {
    console.log('Sending test email...');
    await sendWelcomeEmail('test@example.com', 'Test User', 'password123');
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:', error.message);
    if (error.response && error.response.body) {
      console.error('SendGrid Response:', JSON.stringify(error.response.body, null, 2));
    }
  }
}

test();
