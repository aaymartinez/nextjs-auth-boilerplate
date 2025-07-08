"use client";

import {
	BadgeCheck,
	// Bell,
	ChevronsUpDown,
	// CreditCard,
	LogOut,
	// Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { User } from "@/lib/type/user";

export function NavUser({ user }: { user: User }) {
	const { isMobile } = useSidebar();

	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	
	console.log("user: ", user);
	
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
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user.image || "/images/avatar.jpg"}
									alt={user.name}
								/>
								<AvatarFallback className="rounded-lg">
									CN
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{user.name}
								</span>
								<span className="truncate text-xs">
									{user.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						{/*<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.image || "/images/avatar.jpg"}
										alt={user.name}
									/>
									<AvatarFallback className="rounded-lg">
										CN
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.name}
									</span>
									<span className="truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator /> */}
						{/* <DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup> */}
						{/* <DropdownMenuSeparator /> */}
						{/* <DropdownMenuGroup> */}
							{/* <DropdownMenuItem asChild>
								<Link href="/account">
									<BadgeCheck />
									Account
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Change Password
							</DropdownMenuItem> */}
							{/* <DropdownMenuItem>
								<CreditCard />
								Billing
							</DropdownMenuItem> */}
							{/* <DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem> */}
						{/* </DropdownMenuGroup> */}
						{/* <DropdownMenuSeparator /> */}
						<DropdownMenuItem
							onClick={handleLogout}
							disabled={isLoading}
						>
							<LogOut />
							{isLoading ? "Logging out..." : "Log out"}{" "}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
