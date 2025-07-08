"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

export function Logout() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		setIsLoading(true);

		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
				},
			},
		});

		toast.success("Logged out successfully.");

		setIsLoading(false);
	};

	return (
		<Button
			className="cursor-pointer"
			onClick={handleLogout}
			disabled={isLoading}
		>
			<LogOutIcon className="ml-2 size-4" />
			{isLoading ? "Logging out..." : "Log out"}{" "}
		</Button>
	);
}
