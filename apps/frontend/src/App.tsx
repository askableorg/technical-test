import {
  Routes,
  Route,
} from "react-router-dom";
import { Product, Products } from "./components";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/:id" element={<Product />} />
      </Routes>
    </div>
  );
}

export default App;
