import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";
import { NavMainType } from "./type/nav";

export const mainNavigation: NavMainType[] = [
	{
		title: "Playground",
		url: "#",
		isLink: false,
		icon: SquareTerminal,
		items: [
			{
				title: "History",
				url: "#",
			},
			{
				title: "Starred",
				url: "#",
			},
			{
				title: "Settings",
				url: "#",
			},
		],
	},
	{
		title: "Models",
		url: "#",
		isLink: false,
		icon: Bot,
		items: [
			{
				title: "Genesis",
				url: "#",
			},
			{
				title: "Explorer",
				url: "#",
			},
			{
				title: "Quantum",
				url: "#",
			},
		],
	},
	{
		title: "Documentation",
		url: "#",
		isLink: false,
		icon: BookOpen,
		items: [
			{
				title: "Introduction",
				url: "#",
			},
			{
				title: "Get Started",
				url: "#",
			},
			{
				title: "Tutorials",
				url: "#",
			},
			{
				title: "Changelog",
				url: "#",
			},
		],
	},
	{
		title: "Settings",
		url: "#",
		isLink: false,
		icon: Settings2,
		items: [
			{
				title: "Account Information",
				url: "/account",
			},
			{
				title: "Change Password",
				url: "/change-password",
			},
			// {
			// 	title: "Billing",
			// 	url: "#",
			// },
			// {
			// 	title: "Limits",
			// 	url: "#",
			// },
		],
	},
];

// const data = {
// 	navMain: [],
// 	navSecondary: [
// 		{
// 			title: "Support",
// 			url: "#",
// 			icon: LifeBuoy,
// 		},
// 		{
// 			title: "Feedback",
// 			url: "#",
// 			icon: Send,
// 		},
// 	],
// 	projects: [
// 		{
// 			name: "Design Engineering",
// 			url: "#",
// 			icon: Frame,
// 		},
// 		{
// 			name: "Sales & Marketing",
// 			url: "#",
// 			icon: PieChart,
// 		},
// 		{
// 			name: "Travel",
// 			url: "#",
// 			icon: Map,
// 		},
// 	],
// };
