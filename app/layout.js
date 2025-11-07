import { Inter } from "next/font/google";
import "./globals.css";
import { Web3ModalProvider } from "./context/Web3Modal";
import { FarcasterProvider } from "./context/FarcasterProvider";

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata = {
  title: "Guest Book - Leave Your Message",
  description: "Leave your message on the blockchain forever",
  openGraph: {
    title: "Guest Book",
    description: "Leave your message on the blockchain forever",
    images: [`${appUrl}/api/og`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${appUrl}/api/og`,
    'fc:frame:button:1': 'View Stats',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': `${appUrl}/frame`,
    'fc:frame:button:2': 'Open App',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${appUrl}`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Web3ModalProvider>
          <FarcasterProvider>
            {children}
          </FarcasterProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
