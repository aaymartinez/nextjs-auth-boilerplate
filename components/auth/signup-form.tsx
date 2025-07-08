"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { signUp } from "@/server/users";
// Uncomment the following line if you want to use auth client
// import { authClient } from "@/lib/auth-client";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const formSchema = z.object({
	name: z.string().min(3, "Name is required"),
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long." })
		.regex(/[a-zA-Z]/, {
			message: "Password must contain at least one letter.",
		})
		.regex(/[0-9]/, {
			message: "Password must contain at least one number.",
		})
		.regex(/[^a-zA-Z0-9]/, {
			message: "Password must contain at least one special character.",
		})
		.trim(),
});

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [newPassword, setNewPassword] = useState("");

	// Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const getPasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/\d/.test(password)) strength++;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

		if (strength <= 2)
			return { level: "weak", color: "bg-red-500", text: "Weak" };
		if (strength <= 3)
			return { level: "medium", color: "bg-yellow-500", text: "Medium" };
		return { level: "strong", color: "bg-green-500", text: "Strong" };
	};

	const passwordStrength = getPasswordStrength(newPassword);

	// Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		const { success, message } = await signUp(
			values.name,
			values.email,
			values.password
		);
		if (!success) {
			toast.error(message);
		} else {
			toast.success(message);
			router.push("/login");
		}

		setIsLoading(false);
	}

	function togglePasswordVisibility() {
		setVisible((prev) => !prev);
	}

	// Uncomment the following lines if you want to use auth client for Google sign-in
	// Google sign-in handler
	// const signInWithGoogle = async () => {
	// 	await authClient.signIn.social({
	// 		provider: "google",
	// 		callbackURL: "/dashboard",
	// 	});
	// };

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("flex flex-col gap-6 space-y-8", className)}
				{...props}
			>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Welcome</h1>
					<p className="text-muted-foreground text-balance">
						Sign-up your Acme Inc account
					</p>
				</div>

				<div className="grid gap-6">
					<div className="grid gap-3">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid gap-3">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="user@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid gap-3">
						<div className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="*********"
													{...field}
													type={
														visible
															? "text"
															: "password"
													}
													value={newPassword}
													onChange={(e) =>
														setNewPassword(
															e.target.value
														)
													}
												/>

												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={
														togglePasswordVisibility
													}
												>
													{visible ? (
														<EyeOff className="h-4 w-4 text-gray-500" />
													) : (
														<Eye className="h-4 w-4 text-gray-500" />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{newPassword && (
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>Password strength:</span>
								<span
									className={`font-medium ${
										passwordStrength.level === "weak"
											? "text-red-600"
											: passwordStrength.level ===
												  "medium"
												? "text-yellow-600"
												: "text-green-600"
									}`}
								>
									{passwordStrength.text}
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
									style={{
										width:
											passwordStrength.level === "weak"
												? "33%"
												: passwordStrength.level ===
													  "medium"
													? "66%"
													: "100%",
									}}
								/>
							</div>
						</div>
					)}

					<div className="space-y-4">
						<div className="text-sm text-gray-600">
							<p className="font-medium mb-2">
								Password requirements:
							</p>
							<ul className="space-y-1 text-xs">
								<li className="flex items-center gap-2">
									<div
										className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
									/>
									At least 8 characters
								</li>
								<li className="flex items-center gap-2">
									<div
										className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
									/>
									One uppercase letter
								</li>
								<li className="flex items-center gap-2">
									<div
										className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
									/>
									One lowercase letter
								</li>
								<li className="flex items-center gap-2">
									<div
										className={`w-1.5 h-1.5 rounded-full ${/\d/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
									/>
									One number
								</li>
								<li className="flex items-center gap-2">
									<div
										className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
									/>
									One special character
								</li>
							</ul>
						</div>
					</div>

					<Button
						type="submit"
						className="w-full cursor-pointer"
						disabled={isLoading}
					>
						<UserPlus />
						{isLoading ? "Signing up..." : "Sign Up"}
					</Button>

					{/* Uncomment to use Google Signup */}
					{/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
						<span className="bg-background text-muted-foreground relative z-10 px-2">
							Or continue with
						</span>
					</div>
					<Button
						type="button"
						variant="outline"
						className="w-full cursor-pointer"
						onClick={signInWithGoogle}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path
								d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
								fill="currentColor"
							/>
						</svg>
						Sign-up with Google
					</Button> */}
				</div>
				<div className="text-center text-sm">
					Have an account?{" "}
					<Link
						href="/login"
						className="underline underline-offset-4"
					>
						Login
					</Link>
				</div>
			</form>
		</Form>
	);
}
