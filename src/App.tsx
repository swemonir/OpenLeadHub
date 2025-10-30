import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./page/Home";
import Contact from "./page/Contact";
import Terms from "./page/Terms";
import About from "./page/About";
import Layout from "./layout/Layout";
import Payment from "./page/Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXXXXXXX");

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
            <Route path="/payment" element={<Payment />} />
          </Route>
        </Routes>
      </Elements>
    </BrowserRouter>
  );
};

export default App;
