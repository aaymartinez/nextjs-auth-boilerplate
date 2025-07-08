import { getCurrentUser } from "@/server/session";
import Header from "@/components/header";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const { data } = useSession();

	const user = await getCurrentUser();
	if (!user) redirect("/login");

	return (
		<SidebarProvider>
			<AppSidebar user={user} />
			<SidebarInset>
				<Header />

				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
					{/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
					</div>
					<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
