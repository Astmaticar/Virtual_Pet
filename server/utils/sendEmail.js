const sendEmail = async ({ to, subject, text, html, resetUrl }) => {
  const emailJsConfig = [
    'EMAILJS_SERVICE_ID',
    'EMAILJS_TEMPLATE_ID',
    'EMAILJS_PUBLIC_KEY',
    'EMAILJS_PRIVATE_KEY',
  ];
  const missingConfig = emailJsConfig.filter((key) => !process.env[key]);
  const hasAnyEmailJsConfig = emailJsConfig.some((key) => process.env[key]);

  if (missingConfig.length === 0) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY,
          template_params: {
            to_email: to,
            subject,
            message: text,
            reset_url: resetUrl,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`EmailJS API error ${response.status}: ${errorBody}`);
      }

      return { provider: 'emailjs' };
    } catch (error) {
      console.error('EmailJS delivery error:', error.message);
      throw error;
    }
  }

  if (hasAnyEmailJsConfig && missingConfig.length > 0) {
    throw new Error(`Missing EmailJS configuration: ${missingConfig.join(', ')}`);
  }

  const nodemailer = require('nodemailer');
  const testAccount = await nodemailer.createTestAccount();
  console.log(`Using Ethereal test account: ${testAccount.user}`);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  const info = await transporter.sendMail({
    from: testAccount.user,
    to,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log(`Ethereal preview URL: ${previewUrl}`);

  return info;
};

module.exports = sendEmail;
