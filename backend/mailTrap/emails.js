import { mailtrapClient, sender } from "./mailtrap.config.js";
import { WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email,name) => {
    const recipient = [{email}] ; 

    try {
        const response = await mailtrapClient.send({
            from : sender , 
            to : recipient ,
            html: WELCOME_EMAIL_TEMPLATE.replace("userName",name),
            category: "Welcome Email",
            subject: "Welcome to our E-commerce platform"
        });
        
    }catch(err) {
    console.error('Error sending email:', err);
        throw new Error("Failed to send welcome email");
    }
}