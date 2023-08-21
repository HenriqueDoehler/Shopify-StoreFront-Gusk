import { useState } from "react";
import AppContext from "../context/AppContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [data, setData] = useState({
    name: "John Doe",
  });

  return (
    <AppContext.Provider value={{ data, setData }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
