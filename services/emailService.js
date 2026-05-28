const { Resend } = require('resend');

//eto platno, nafig
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = resend;