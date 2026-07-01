require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get(["/", "/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const TARGET_EMAIL = process.env.TARGET_EMAIL || process.env.CONTACT_EMAIL || 'info@painpointsolution.in';
const SENDER_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER || 'kushwaha2814@gmail.com';

async function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
}

app.get(['/health', '/api/health'], (_req, res) => {
  res.json({ ok: true, service: 'painpoint-contact-backend' });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ ok: false, message: 'Not found.' });
  }

  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.post(['/contact', '/api/contact'], async (req, res) => {
  const { name, email, mobile, phone, company, message, page } = req.body || {};
  const contactPhone = mobile || phone || '';

  if (!name || !email || !contactPhone || !message) {
    return res.status(400).json({ ok: false, message: 'Missing required fields.' });
  }

  try {
    const transporter = await createTransport();
    await transporter.verify();

    const mailOptions = {
      from: SENDER_EMAIL,
      to: TARGET_EMAIL,
      subject: `Website Contact Form — ${name}`,
      replyTo: email,
      text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${contactPhone}\nCompany: ${company || ''}\nPage: ${page || ''}\n\nMessage:\n${message}`,
      html: `<h2>New contact form submission</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${contactPhone}</p>
             <p><strong>Company:</strong> ${company || ''}</p>
             <p><strong>Page:</strong> ${page || ''}</p>
             <h3>Message</h3>
             <p>${message.replace(/\n/g, '<br>')}</p>`
    };

    const info = await transporter.sendMail(mailOptions);

    let preview = null;
    if (nodemailer.getTestMessageUrl) preview = nodemailer.getTestMessageUrl(info);

    return res.json({ ok: true, message: 'Message sent', preview });
  } catch (err) {
    console.error('Error sending contact email:', err);
    return res.status(500).json({ ok: false, message: 'Failed to send message.' });
  }
});

const PORT = process.env.PORT || 8080;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Contact backend listening on http://localhost:${PORT}`);
    console.log(`Contact form submissions will be sent to: ${TARGET_EMAIL}`);
  });
}

module.exports = app;
