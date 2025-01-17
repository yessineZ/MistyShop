export const WELCOME_EMAIL_TEMPLATE = ` 
<!DOCTYPE html> 
<html lang="en"> 
<head> 
  <meta charset="UTF-8"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
  <title>Welcome to MistyStore!</title> 
</head> 
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"> 
  <div style="background: linear-gradient(to right, #4A154B, #BB4D90); padding: 20px; text-align: center;"> 
    <h1 style="color: #ffffff; margin: 0;">Welcome to MistyStore!</h1> 
  </div> 
  <div style="background-color: #f7f7f7; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"> 
    <p>Hello {userName},</p> 
    <p>We’re thrilled to have you join us! At MistyStore, we are committed to providing you with the best experience possible.</p> 
    <p>Here are some things you can do to get started:</p> 
    <ul> 
      <li>Explore our platform and familiarize yourself with the features.</li> 
      <li>Customize your profile to make it uniquely yours.</li> 
      <li>Reach out to our support team if you have any questions.</li> 
    </ul> 
    <p>We’re here to support you every step of the way. If you have any questions, feel free to reach out at any time.</p> 
    <p>Welcome aboard, and let’s make amazing things happen together!</p> 
    <p>Best regards,<br>The MistyStore</p> 
  </div> 
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;"> 
    <p>This is an automated message, please do not reply to this email.</p> 
  </div> 
</body> 
</html> 
`;
