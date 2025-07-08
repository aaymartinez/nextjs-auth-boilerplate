"use server";

import nodemailer from "nodemailer";

// check if required environment variables are set
if (
	!process.env.EMAIL_HOST ||
	!process.env.EMAIL_PORT ||
	!process.env.EMAIL_USER ||
	!process.env.EMAIL_PASS
) {
	throw new Error("Missing required email environment variables.");
}

const from = `Taskpedia <${process.env.EMAIL_HOST as string}>`;

type SendEmailOptions = {
	to: string;
	subject: string;
	html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
	// setting up tranport options
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST as string,
		port: Number(process.env.EMAIL_PORT),
		auth: {
			user: process.env.EMAIL_USER as string,
			pass: process.env.EMAIL_PASS as string,
		},
	});

	try {
		await transporter.sendMail({
			from: from,
			to: to,
			// cc: email, (uncomment this line if you want to send a copy to the sender)
			subject: subject,
			html: html,
		});
	} catch (error) {
		throw error;
	}
};
