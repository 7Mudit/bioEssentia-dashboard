"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },

    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/flavours`,
      label: "Flavours",
      active: pathname === `/${params.storeId}/flavours`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/combos`,
      label: "Combos",
      active: pathname === `/${params.storeId}/combos`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/authenticate`,
      label: "Authenticate",
      active: pathname === `/${params.storeId}/authenticate`,
    },
    {
      href: `/${params.storeId}/coupons`,
      label: "Coupons",
      active: pathname === `/${params.storeId}/coupons`,
    },
    {
      href: `/${params.storeId}/feedbacks`,
      label: "Feedbacks",
      active: pathname === `/${params.storeId}/feedbacks`,
    },
    {
      href: `/${params.storeId}/seo`,
      label: "Seo",
      active: pathname === `/${params.storeId}/seo`,
    },
    {
      href: `/${params.storeId}/blogs`,
      label: "Blog",
      active: pathname === `/${params.storeId}/blogs`,
    },
    {
      href: `/${params.storeId}/users`,
      label: "Users",
      active: pathname === `/${params.storeId}/user`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
