import { Navbar } from "../Navbar/Navbar";
import { Sidebar } from "../Sidebar/Sidebar";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout-content">
        <Navbar />

        <main className="layout-main">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};