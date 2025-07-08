import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAccount } from "@/lib/queries/get-account";
import { getCurrentUser } from "@/server/session";
import { redirect } from "next/navigation";

export default async function Page() {
	let account = null;
	try {
		// check current session
		const user = await getCurrentUser();
		if (!user) redirect("/login");

		account = await getAccount(user.id);

		if (!account) {
			console.log("No account found!");
		}
	} catch (e) {
		if (e instanceof Error) {
			throw e;
		}
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			account
			<div className="flex flex-1 gap-4">
				<Avatar className="h-32 w-32 rounded-lg">
					<AvatarImage
						src={account?.image || "/images/avatar.jpg"}
						alt={account?.name}
					/>
					<AvatarFallback className="rounded-lg">CN</AvatarFallback>
				</Avatar>

				<div className="flex flex-1 flex-col text-left text-2xl leading-tight pt-10">
					<span className="truncate font-medium">{account?.name}</span>
					<span className="truncate text-xs">{account?.email}</span>
				</div>
			</div>
		</div>
	);
}
