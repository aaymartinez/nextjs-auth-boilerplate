"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavMainType } from "@/lib/type/nav";
import { usePathname } from "next/navigation";

export function NavMain({ items }: { items: NavMainType[] }) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					// Check if the current item or any sub-item matches the pathname
					const isActive =
						item.url === pathname ||
						(item.items?.some((sub) => sub.url === pathname) ??
							false);

					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={isActive}
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton asChild>
										{item.isLink ? (
											<div className="relative">
												<Link href={item.url}>
													<item.icon />
													<span>{item.title}</span>
												</Link>
											</div>
										) : (
											<div className="relative">
												<item.icon />
												<span>{item.title}</span>
											</div>
										)}
									</SidebarMenuButton>
								</CollapsibleTrigger>
								{item.items?.length && (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className="data-[state=open]:rotate-90">
												<ChevronRight />
												<span className="sr-only">
													Toggle
												</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map((subItem) => (
													<SidebarMenuSubItem
														key={subItem.title}
													>
														<SidebarMenuSubButton
															asChild
														>
															<Link
																href={
																	subItem.url
																}
															>
																<span>
																	{
																		subItem.title
																	}
																</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								)}
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
