import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Flowmate - Collaborative Agile Project Management",
  description:
    "A modern, collaborative agile project management web application similar to GitHub Projects and ZenHub.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ErrorBoundary>
            <Providers>{children}</Providers>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
