"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import Navbar from "./Components/Navbar";
const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Project management",
//   description: "Project management system",
// };
const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
        <Navbar />
          <AntdRegistry>{children}</AntdRegistry>
          <ToastContainer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
