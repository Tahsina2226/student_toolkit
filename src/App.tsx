import { Outlet } from "react-router-dom";
import Navbar from "./layouts/navbar";
import Footer from "./layouts/footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
