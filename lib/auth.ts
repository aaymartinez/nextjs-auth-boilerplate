import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
import { sendEmail } from "../server/email";

export const auth = betterAuth({
	appName: "Taskpedia",
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 8,
		requireEmailVerification: true,

		// password reset
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: "Reset your password",
				html: `
					<p>Hi ${user.name},</p>
       				<p>Click the link to reset your password:
	       				<a href="${url}">Click here.</a>
					</p>
	 				<p>Thanks,</p>
					<p>Taskpedia Team</p>`,
			});

			// for resend
			// resend.emails.send({
			// 	from: "onboarding@resend.dev",
			// 	to: user.email,
			// 	subject: "Reset your password",
			// 	react: ForgotPassword({ userEmail: user.email, resetUrl: url }),
			// })
		},
	},

	emailVerification: {
		enabled: true,
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			// const baseUrl =
			// 	process.env.BETTER_AUTH_URL || "http://localhost:3000";
			// const roleBasedRedirect =
			// user.role === "admin" ? "/admin" : "/dashboard";
			// const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${url}&callbackURL=/dashboard`;

			await sendEmail({
				to: user.email,
				subject: "Verify your email address",
				html: `
					<p>Hi ${user.name},</p>
	      			<p>Please verify your email by clicking the link below:</p>
	      			<a href="${url}">Click here.</a>
					<p>Thanks,</p>
					<p>Taskpedia Team</p>`,
			});
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24 * 30, // 30 days
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	plugins: [nextCookies()],
});
