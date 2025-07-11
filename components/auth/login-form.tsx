"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { signIn } from "@/server/users";
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
import { Eye, EyeOff, LogInIcon } from "lucide-react";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);

	// Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);

		const { success, message } = await signIn(
			values.email,
			values.password
		);

		if (!success) {
			toast.error(message);
		} else {
			toast.success(message);
			router.push("/dashboard");
		}

		setLoading(false);
	}

	function togglePasswordVisibility() {
		setVisible((prev) => !prev);
	}

	// Uncomment the following lines if you want to use auth client for social sign-in
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
					<h1 className="text-2xl font-bold">Welcome back</h1>
					<p className="text-muted-foreground text-balance">
						Login to your Acme Inc account
					</p>
				</div>

				<div className="grid gap-6">
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

							<Link
								href="/forgot-password"
								className="ml-auto text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</Link>
						</div>
					</div>

					<Button
						type="submit"
						className="w-full cursor-pointer"
						disabled={loading}
					>
						<LogInIcon />
						{loading ? "Logging in..." : "Login"}
					</Button>

					{/* Uncomment to use Google Signin  */}
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
						Login with Google
					</Button> */}
				</div>
				<div className="text-center text-sm">
					Don't have an account?{" "}
					<Link
						href="/signup"
						className="underline underline-offset-4"
					>
						Sign up
					</Link>
				</div>
			</form>
		</Form>
	);
}
