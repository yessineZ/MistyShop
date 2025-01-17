import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

export const mailtrapClient = new MailtrapClient({
	endpoint: process.env.ENDPOINT,
	token: process.env.TOKEN,
});

export const sender = {
	email: "hello@demomailtrap.com",
	name: "misty",
};