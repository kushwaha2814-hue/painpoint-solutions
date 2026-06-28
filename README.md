# Painpoint Solution Website

A complete, responsive business website built with HTML, CSS, JavaScript, and Node.js for **Painpoint Solution**.

## Features

- **Responsive Design** — Works on desktop, tablet, and mobile
- **Modern UI/UX** — Clean, professional business theme
- **Smooth Scrolling** — One-page navigation with active link highlighting
- **Mobile Menu** — Hamburger navigation for smaller screens
- **Contact Form** — Client-side validation with email notifications
- **Scroll Animations** — Reveal animations on scroll
- **Back to Top Button** — Appears after scrolling
- **Parallax Hero** — Subtle background parallax effect

## Sections Included

1. **Navigation Bar** — Logo/text, menu links, CTA button
2. **Hero Banner** — Main headline, tagline, CTA buttons, stats
3. **About Us** — Company introduction with image
4. **Why Choose Us** — 6-card grid of strengths
5. **Our Products & Services** — 6 service cards
6. **Upcoming Concepts & Innovation** — 5 concept cards
7. **Contact Us** — Contact form + company information
8. **Footer** — Quick links, services, contact info, GSTIN

## File Structure

```
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Stylesheet
├── js/
│   └── script.js       # JavaScript interactions
├── photos/
│   ├── NEW.jpeg
│   ├── about-banner.jpg
│   ├── hero-port.jpg
│   ├── logo.jpg
│   └── products.jpg
├── server.js           # Express backend for contact form emails
├── package.json        # Node.js dependencies
├── package-lock.json   # Locked dependency versions
├── .env                # Email/SMTP configuration (not committed)
├── .gitignore          # Files ignored by Git
└── README.md           # This file
```

## How to Run Locally

1. Make sure **Node.js** is installed.
2. Open a terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open your browser and visit:

   ```
   http://localhost:3000
   ```

## Contact Form Email Setup

Contact form submissions are sent to **kushwaha2814@gmail.com**.

The project uses Gmail SMTP via an **App Password** stored in `.env`.

### If you need to change the sender email or App Password

1. Open `.env` in any text editor.
2. Update these values:

   ```env
   TARGET_EMAIL=kushwaha2814@gmail.com
   FROM_EMAIL=kushwaha2814@gmail.com
   SMTP_USER=kushwaha2814@gmail.com
   SMTP_PASS=your-gmail-app-password
   ```

3. Restart the server.

### How to generate a Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security).
2. Enable **2-Step Verification**.
3. Visit [App Passwords](https://myaccount.google.com/apppasswords).
4. Select **Other (Custom name)** and enter `Painpoint Website`.
5. Click **Generate**.
6. Copy the 16-character password and paste it into `.env` as `SMTP_PASS`.

> **Note:** A normal Gmail password will not work. You must use an App Password.

## Contact Information

- **Company:** Painpoint Solution
- **Address:** Delhi, India
- **Email:** info@painpointsolution.in
- **Mobile:** +91-8527586110
- **Website:** painpointsolution.in
- **GSTIN:** 07CNVPR2705K1ZN
