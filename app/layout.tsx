import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Headless SSR examples",
  description: "Examples of using @coveo/headless-react/ssr-commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* ...existing code... */}</head>
      <body className="app-body">
        <h1 className="app-title">Coveo Headless Commerce Next.js</h1>
        <nav className="app-nav">
          <Link href={"/"}>Home</Link>
          <Link href={"/search"}>Search</Link>
          <Link href={"/surf-accessories"}>Surf Accessories</Link>
          <Link href={"/paddleboards"}>Paddleboards</Link>
          <Link href={"/toys"}>Toys</Link>
        </nav>{" "}
        <br />
        <div className="children-container">{children}</div>
      </body>
    </html>
  );
}
