import "./globals.css";

export const metadata = {
  title: "GymFlow CRM",
  description: "Gym Management CRM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}