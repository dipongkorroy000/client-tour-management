import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>
      <div className="grow-1">{children}</div>
      <Footer></Footer>
    </div>
  );
}
