"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
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
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, SendHorizonal } from "lucide-react";

const formSchema = z.object({
	password: z.string().min(8, {
		message: "Password must be at least 8 characters long",
	}),
	confirmPassword: z.string().min(8),
});

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	console.log("token:", token);
	const [isLoading, setIsLoading] = useState(false);

	// Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	function togglePasswordVisibility() {
		setShowPassword((prev) => !prev);
	}

	function toggleConfirmPasswordVisibility() {
		setShowConfirmPassword((prev) => !prev);
	}

	// Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		if (values.password !== values.confirmPassword) {
			toast.error("Passwords do not match");
			setIsLoading(false);
			return;
		}

		console.log("Resetting password with token:", token);
		if (!token) {
			toast.error("Invalid or missing reset token");
			setIsLoading(false);
			return;
		}

		const { error } = await authClient.resetPassword({
			newPassword: values.password,
			token,
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Password reset successfully!");
			router.push("/login");
		}

		setIsLoading(false);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("flex flex-col gap-6 space-y-8", className)}
				{...props}
			>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Reset Password</h1>
					<p className="text-muted-foreground text-balance">
						Enter your new password.
					</p>
				</div>

				<div className="grid gap-6">
					<div className="grid gap-3">
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
													showPassword
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
												{showPassword ? (
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

					<div className="grid gap-3">
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												placeholder="*********"
												{...field}
												type={
													showConfirmPassword
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
													toggleConfirmPasswordVisibility
												}
											>
												{showConfirmPassword ? (
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

					<Button
						type="submit"
						className="w-full cursor-pointer"
						disabled={isLoading}
					>
						<SendHorizonal />
						{isLoading ? "Resetting password..." : "Reset Password"}
					</Button>
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
