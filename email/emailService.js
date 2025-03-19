const { sendEmail } = require("../utils/setEmail")

const sendEmailVerificationEmail = async (user) => {
  const options = {
    from: "no-reply@ecommerce.com",
    to: user.email,
    subject: "Email Verification OTP",
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Our Platform</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 20px auto;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: #007bff;
                    color: white;
                    text-align: center;
                    padding: 20px;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .content p {
                    font-size: 16px;
                    color: #333;
                    margin: 10px 0;
                }
                .otp-box {
                    display: inline-block;
                    background: #f1f1f1;
                    padding: 12px 20px;
                    font-size: 20px;
                    font-weight: bold;
                    letter-spacing: 4px;
                    border-radius: 5px;
                    margin: 15px 0;
                    color: #007bff;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #555;
                    padding: 15px;
                    background: #f1f1f1;
                    border-top: 1px solid #ddd;
                }
                /* Responsive Design */
                @media (max-width: 600px) {
                    .content {
                        padding: 15px;
                    }
                    .header {
                        font-size: 20px;
                        padding: 15px;
                    }
                    .otp-box {
                        font-size: 18px;
                        padding: 10px 18px;
                    }
                    .button {
                        font-size: 14px;
                        padding: 10px 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Welcome to Our Platform!</div>
                <div class="content">
                    <p>Hello <b>${user.name}</b>,</p>
                    <p>Thank you for joining us! We are excited to have you on board.</p>
                    <p>Your One-Time Password (OTP) for email verification is:</p>
                    <div class="otp-box">${user.otp}</div>
                    <p>Please enter this OTP in the app to verify your email address.</p>
                    <a href="" class="button">Verify My Email</a>
                </div>
                <div class="footer">© 2025 Company Name. All rights reserved.</div>
            </div>
        </body>
        </html>

    `,
  }

//   await sendEmail(options);
  await sendEmail(options)
}

module.exports = {sendEmailVerificationEmail}