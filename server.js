require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const TARGET_EMAIL = process.env.TARGET_EMAIL || 'kushwaha2814@gmail.com';

async function createTransport() {
  // If SMTP env vars provided, use them; otherwise use Ethereal test account
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }

  // Fallback to Ethereal for testing (no credentials required)
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
}

app.post('/contact', async (req, res) => {
  const { name, email, mobile, message, page } = req.body || {};
  if (!name || !email || !mobile || !message) {
    return res.status(400).json({ ok: false, message: 'Missing required fields.' });
  }

  try {
    const transporter = await createTransport();

    const mailOptions = {
      from: process.env.FROM_EMAIL || `no-reply@painpointsolution.in`,
      to: TARGET_EMAIL,
      subject: `Website Contact Form — ${name}`,
      replyTo: email,
      text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nPage: ${page || ''}\n\nMessage:\n${message}`,
      html: `<h2>New contact form submission</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mobile:</strong> ${mobile}</p>
             <p><strong>Page:</strong> ${page || ''}</p>
             <h3>Message</h3>
             <p>${message.replace(/\n/g, '<br>')}</p>`
    };

    const info = await transporter.sendMail(mailOptions);

    // If using Ethereal, return preview URL
    let preview = null;
    if (nodemailer.getTestMessageUrl) preview = nodemailer.getTestMessageUrl(info);

    return res.json({ ok: true, message: 'Message sent', preview });
  } catch (err) {
    console.error('Error sending contact email:', err);
    return res.status(500).json({ ok: false, message: 'Failed to send message.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Contact backend listening on http://localhost:${PORT}`);
  console.log(`Contact form submissions will be sent to: ${TARGET_EMAIL}`);
});
