export const welcomeEmail = (userData) => {
  const { username, email, otp } = userData;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Protection Pool</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; line-height: 1.6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                                Protection Pools
                            </h1>
                            <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                Your Premier Betting Platform
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">
                                Welcome, ${username}!
                            </h2>
                            <p style="margin: 0 0 20px; color: #666666; font-size: 16px;">
                                Thank you for joining Protection Pool! Your account has been successfully created. To complete your registration and start placing bets, please verify your email address using the code below.
                            </p>

                            <!-- OTP Verification Box -->
                            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #dc2626; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                                <p style="margin: 0 0 15px; color: #991b1b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                    Your Verification Code
                                </p>
                                <div style="background-color: #ffffff; border: 3px solid #dc2626; border-radius: 8px; padding: 20px; margin: 15px 0;">
                                    <p style="margin: 0; color: #dc2626; font-size: 36px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 8px;">
                                        ${otp}
                                    </p>
                                </div>
                                <p style="margin: 15px 0 0; color: #991b1b; font-size: 12px;">
                                    This code will expire in 10 minutes
                                </p>
                            </div>

                            <!-- Verification Instructions -->
                            <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 4px;">
                                <h3 style="margin: 0 0 12px; color: #0369a1; font-size: 16px; font-weight: 600;">
                                    📧 How to Verify Your Email
                                </h3>
                                <ol style="margin: 0; padding-left: 20px; color: #0369a1; font-size: 14px; line-height: 1.8;">
                                    <li style="margin-bottom: 8px;">Go to the verification page on Protection Pool</li>
                                    <li style="margin-bottom: 8px;">Enter the 6-digit code shown above: <strong style="font-family: 'Courier New', monospace; background-color: #fff; padding: 2px 6px; border-radius: 3px;">${otp}</strong></li>
                                    <li style="margin-bottom: 8px;">Click "Verify Email" to complete your registration</li>
                                    <li>Start placing bets and winning big!</li>
                                </ol>
                            </div>

                            <!-- Security Reminder -->
                            <div style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #c53030; font-size: 14px;">
                                    <strong>🔒 Security Reminder:</strong> Never share your verification code with anyone. Protection Pool will never ask you for your code via phone or email. If you didn't request this code, please ignore this email.
                                </p>
                            </div>

                            <!-- What's Next -->
                            <div style="margin: 30px 0;">
                                <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">
                                    What's Next?
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px; line-height: 1.8;">
                                    <li>Verify your email address using the code above</li>
                                    <li>Complete your profile setup</li>
                                    <li>Make your first deposit to start betting</li>
                                    <li>Explore our wide range of sports and betting markets</li>
                                    <li>Place your bets and enjoy the excitement!</li>
                                </ul>
                            </div>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://protectionpool.com/verify" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);">
                                            Verify Your Email
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Account Details -->
                            <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="margin: 0 0 15px; color: #333333; font-size: 16px; font-weight: 600;">
                                    Your Account Information
                                </h3>
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px; width: 40%;">Username:</td>
                                        <td style="padding: 6px 0; color: #333333; font-size: 14px; font-weight: 600;">${username}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Email:</td>
                                        <td style="padding: 6px 0; color: #333333; font-size: 14px; font-weight: 600;">${email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #666666; font-size: 14px;">Initial Balance:</td>
                                        <td style="padding: 6px 0; color: #28a745; font-size: 16px; font-weight: 700;">₦0.00</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                                Need help? Contact our support team:
                            </p>
                            <p style="margin: 0 0 10px; color: #dc2626; font-size: 14px;">
                                <a href="mailto:support@protectionpool.com" style="color: #dc2626; text-decoration: none; font-weight: 600;">
                                    support@protectionpool.com
                                </a>
                            </p>
                            <p style="margin: 15px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                                Visit us at: <a href="https://protectionpool.com" style="color: #dc2626; text-decoration: none;">protectionpool.com</a><br>
                                This is an automated email from Protection Pools. Please do not reply to this email.<br>
                                © ${new Date().getFullYear()} Protection Pools Nigeria. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};
