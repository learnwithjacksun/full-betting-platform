import axios from 'axios';
import process from 'process';

const sendEmail = async (subject, htmlContent, to, name) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "Protection Pools Nigeria",
          email: "noreply@protectionpools.com",
        },
        to: [
          {
            email: to,
            name: name,
          },
        ],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error("Failed to send email:", error.response?.data || error.message);
  }
};

export default sendEmail;