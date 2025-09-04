import { Outlet } from "react-router-dom";
import Navbar from "./layouts/navbar";

function App() {
  return (
    <div>
      <Navbar />
      <main className="px-6 pt-20">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
