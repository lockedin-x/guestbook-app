import { Inter } from "next/font/google";
import "./globals.css";
import { Web3ModalProvider } from "./context/Web3Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Guest Book - Leave Your Message",
  description: "Leave your message on the blockchain forever",
  openGraph: {
    title: "Guest Book",
    description: "Leave your message on the blockchain forever",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Web3ModalProvider>
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  );
}
