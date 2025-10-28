import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./page/Home";
import Contact from "./page/Contact";
import Terms from "./page/Terms";
import About from "./page/About";
import Layout from "./layout/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
