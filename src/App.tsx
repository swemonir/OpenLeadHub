import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./page/Home";
import Contact from "./page/Contact";
import Terms from "./page/Terms";
import About from "./page/About";
import Layout from "./layout/Layout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51NrtkkG1p3nVEVTLlIhN9JauWDQ4WVtWQ7GTOSj5wjMyrQjjQ7NMU5KyiRYJ3HKn2xXRQU0D9RLyBbdU5LjkKmSb00fo9FLHfW");

const App = () => {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
          </Route>
        </Routes>
      </Elements>
    </BrowserRouter>
  );
};

export default App;
