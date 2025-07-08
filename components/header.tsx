"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mainNavigation } from "@/lib/navigation";

export default function Header() {
	const pathname = usePathname();

	// split and filter URL segments
	const segments = pathname.split("/").filter(Boolean);

	// get the parent
	function getNavItemBySegment(segment: string) {
		return mainNavigation.find((item) =>
			(item.items ?? []).some((i) => i.url === `/${segment}`)
		);
	}
	const parent = getNavItemBySegment(segments[0])?.title;

	return (
		<header className="flex h-16 shrink-0 items-center gap-2">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{parent && parent.length > 0 && (
							<>
								<BreadcrumbItem>
									<BreadcrumbPage>{parent}</BreadcrumbPage>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
							</>
						)}

						{segments.map((segment, index) => {
							const href =
								"/" + segments.slice(0, index + 1).join("/");
							const isLast = index === segments.length - 1;

							return (
								<Fragment key={index}>
									{index > 0 && (
										<BreadcrumbSeparator className="hidden md:block" />
									)}

									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage className="capitalize">
												{segment.replace(/-/g, " ")}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink
												href={href}
												className="capitalize"
											>
												{segment.replace(/-/g, " ")}
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
								</Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
