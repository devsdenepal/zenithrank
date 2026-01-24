import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SEOProvider } from "./SEOContext";
import { LessonProvider } from "./LessonContext";

export const metadata = {
  title: "ZenithRank SEO Sandbox",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-gray-100 min-h-screen flex flex-col">
        <SEOProvider>
          <LessonProvider>
            <Navbar />
            <main className="flex flex-1 overflow-hidden h-[calc(100vh-65px)]">
              <Sidebar />
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
                {children}
              </div>
            </main>
          </LessonProvider>
        </SEOProvider>

      </body>
    </html>
  );
}

