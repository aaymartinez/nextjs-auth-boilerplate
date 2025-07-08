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
import { Send } from "lucide-react";

const formSchema = z.object({
	email: z.string().email(),
});

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const [isLoading, setIsLoading] = useState(false);

	// Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	// Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		const { error } = await authClient.requestPasswordReset({
			email: values.email,
			redirectTo: "/reset-password",
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Password reset email sent successfully!");
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
					<h1 className="text-2xl font-bold">Recover Password</h1>
					<p className="text-muted-foreground text-balance">
						It's okay, we have got this!
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

					<Button
						type="submit"
						className="w-full cursor-pointer"
						disabled={isLoading}
					>
						<Send />
						{isLoading
							? "Sending email..."
							: "Send me a reset password email"}
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
