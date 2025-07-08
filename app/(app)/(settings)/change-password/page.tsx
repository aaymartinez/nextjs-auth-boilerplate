import { ChangePasswordForm } from "@/components/auth/change-password";

export default function Page() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="grid auto-rows-min gap-4 md:grid-cols-2">
				<ChangePasswordForm />
			</div>
		</div>
	);
}
