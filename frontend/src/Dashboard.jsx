import Navigation from "./Navigation";
import Footer from "./Footer";

function Dashboard() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navigation />

      <main className="grow px-8 lg:px-48 py-8 flex flex-col gap-8">

      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;