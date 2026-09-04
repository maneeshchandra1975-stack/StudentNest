require('dotenv').config();
const { sendOTPEmail } = require('./services/email.service');

async function test() {
  console.log('Sending test email to maneeshchandra1975@gmail.com');
  await sendOTPEmail('maneeshchandra1975@gmail.com', '123456', 'Maneesh');
  console.log('Test done.');
}
test();
