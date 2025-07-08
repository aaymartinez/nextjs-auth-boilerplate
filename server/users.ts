"use server";

import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
				callbackURL: "/dashboard",
			},
		});

		return {
			success: true,
			message: "Sign-in successfully.",
		};
	} catch (error) {
		const e = error as Error;

		return {
			success: false,
			message: e.message || "An error occurred during sign-in.",
		};
	}
};

// export const signInWithGoogle = async () => {
//     console.log("Google button clicked");
// 	await authClient.signIn.social({
// 		provider: "google",
//         callbackURL: "/dashboard",
// 	});
// };

export const signUp = async (name: string, email: string, password: string) => {
	try {
		await auth.api.signUpEmail({
			body: {
				name,
				email,
				password,
				callbackURL: "/login",
			},
		});

		return {
			success: true,
			message: "Sign-up successfully. Verification email sent.",
		};
	} catch (error) {
		const e = error as Error;

		return {
			success: false,
			message: e.message || "An error occurred during sign-up.",
		};
	}
};
