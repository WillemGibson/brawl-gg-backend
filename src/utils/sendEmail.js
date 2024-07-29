const dotenv = require("dotenv");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
dotenv.config();
/* POPULATE BELOW FIELDS WITH YOUR CREDENTIALS */
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const MY_EMAIL = process.env.MY_EMAIL;

// REQUEST TO GOOGLE FOR REFRESH TOKEN
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// ADD REFRESH TOKEN TO oAuth2Client
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// DECLARE THE SEND EMAIL FUNCTION WITH EMAIL RECIPIENT, MORE INFORMATION CAN BE PASSED SUCH AS TEMPLATES OR ATTACHMENTS, ETC.
const sendEmail = async (
  emailRecipient,
  template,
  recoveryCode,
  recipientUsername
) => {
  try {
    // GET THE ACCESS TOKEN TO USE YOUR EMAIL
    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
    if (ACCESS_TOKEN.token === null) {
      throw new Error("Failed to obtain access token");
    }

    // CREATE THE TRANSPORT JSON WITH ALL THE DATA ABOVE
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: MY_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN.token,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // EMAIL DATA TO SEND TO THE RECEIVING EMAIL
    let mailOptions = {};
    if (template === "welcome") {
      mailOptions = {
        from: MY_EMAIL,
        to: emailRecipient,
        subject: "Welcome to brawl.gg",
        html: `
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; padding: 20px;">

            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 20px;">
                  <h1 style="color: #007BFF; text-align: center;">Welcome to brawl.gg!</h1>
                  <p style="font-size: 16px;">Hey <strong>${recipientUsername}</strong>,</p>
                  <p style="font-size: 16px;">Thanks for signing up to brawl.gg. We're excited to have you on board and can't wait for you to explore all the exciting features we offer.</p>
                  <p style="font-size: 16px;">Enjoy!</p>
                  <p style="font-size: 16px;">The brawl.gg Team</p>
                </td>
              </tr>
            </table>

          </body>
        `,
      };
    } else {
      mailOptions = {
        from: MY_EMAIL,
        to: emailRecipient,
        subject: "Password recovey",
        html: `
          <p>Hey ${recipientUsername},</p>
          <p>Your recovery code is: <strong>${recoveryCode}</strong></p>
          <p>This code is only valid for 15 minutes.</p>
        `,
      };
    }

    console.log("Mail Options:", mailOptions);

    // SEND EMAIL AND HANDLE ANY ERRORS
    await transport.sendMail(mailOptions);

    return "Recovery email sent";
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    return null;
  }
};

module.exports = { sendEmail };
