import { Outlet } from "react-router-dom";
import Footer from "./layouts/footer";
import Navbar from "./layouts/navbar";
function App() {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet />
      <Footer></Footer>
    </div>
  );
}

export default App;
