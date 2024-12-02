"use client";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "../assets/context/use-context";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Learning Management System</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Provider store={store}>
          <AuthProvider>
            <Toaster position="top-center" />
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
