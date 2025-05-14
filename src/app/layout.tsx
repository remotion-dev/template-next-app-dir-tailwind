import "../../styles/global.css";
import { Metadata, } from "next";

export const metadata: Metadata = {
  title: "Tanglish Captions",
  description: "Get your captions in Tanglish",
};

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background">{children}</body>
    </html>
  );
}
