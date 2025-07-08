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
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

const formSchema = z
	.object({
		currentPassword: z
			.string()
			.min(1, { message: "Current password is required." }),
		newPassword: z
			.string()
			.min(8, { message: "Password must be at least 8 characters long." })
			.regex(/[a-zA-Z]/, {
				message: "Password must contain at least one letter.",
			})
			.regex(/[0-9]/, {
				message: "Password must contain at least one number.",
			})
			.regex(/[^a-zA-Z0-9]/, {
				message:
					"Password must contain at least one special character.",
			})
			.trim(),
		confirmPassword: z
			.string()
			.min(1, { message: "Please confirm your new password." }),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "New password must be different from current password",
		path: ["newPassword"],
	});

export function ChangePasswordForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const [isLoading, setIsLoading] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [newPassword, setNewPassword] = useState("");

	// Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
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

		const { error } = await authClient.changePassword({
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
			revokeOtherSessions: true,
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Password changed successfully!");
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
					<h1 className="text-2xl font-bold">Change Password</h1>
					<p className="text-muted-foreground text-balance">
						Update your password to keep your account secure.
					</p>
				</div>

				<div className="grid gap-6">
					<div className="grid gap-3">
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													showCurrentPassword
														? "text"
														: "password"
												}
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() =>
													setShowCurrentPassword(
														!showCurrentPassword
													)
												}
											>
												{showCurrentPassword ? (
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
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													showNewPassword
														? "text"
														: "password"
												}
												{...field}
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
												onClick={() =>
													setShowNewPassword(
														!showNewPassword
													)
												}
											>
												{showNewPassword ? (
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

					<div className="grid gap-3">
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={
													showConfirmPassword
														? "text"
														: "password"
												}
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() =>
													setShowConfirmPassword(
														!showConfirmPassword
													)
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
						<LockKeyhole />
						{isLoading ? "Changing password..." : "Change password"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
