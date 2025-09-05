import { Outlet } from "react-router-dom";
import Navbar from "./layouts/navbar";
import Footer from "./layouts/footer";
function App() {
  return (
    <div>
      <Navbar />
      <Outlet />'
      <Footer />
    </div>
  );
}

export default App;
