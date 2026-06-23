import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";
import { userRoleSchema } from "@/types/user";

export const metadata: Metadata = {
  title: { default: "FlowLog", template: "%s · FlowLog" },
  description: "Presis dokumentasjon av ølsalg på festivaler.",
  applicationName: "FlowLog",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#090e16" }, { media: "(prefers-color-scheme: light)", color: "#f4f6f8" }], colorScheme: "dark light" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const roleResult = userRoleSchema.safeParse((await headers()).get("x-flowlog-role"));
  const role = roleResult.success ? roleResult.data : null;
  return <html lang="nb" className="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var k='flowlog:tema';var t=localStorage.getItem(k);if(!t){var l=['festival','log'].join('')+':tema';t=localStorage.getItem(l);if(t){localStorage.setItem(k,t);localStorage.removeItem(l)}}t=t||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()` }} /><meta name="apple-mobile-web-app-capable" content="yes" /><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /><meta name="apple-mobile-web-app-title" content="FlowLog" /></head><body><AppProviders><AppShell role={role}>{children}</AppShell></AppProviders></body></html>;
}
