import { useState, useEffect } from "react";
import AppContext from "../context/AppContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [data, setData] = useState({
    cartId: null,
  });

  return (
    <AppContext.Provider value={{ data, setData }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
