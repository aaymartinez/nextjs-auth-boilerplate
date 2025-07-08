import { LucideIcon } from "lucide-react";

export type NavMainType = {
	title: string;
	url: string;
	isLink: boolean;
	icon: LucideIcon;
	items?: {
		title: string;
		url: string;
	}[];
};
