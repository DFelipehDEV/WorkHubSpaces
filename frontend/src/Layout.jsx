import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navigation />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
