import { useState, useEffect } from 'react'
import Navigation from "./Navigation"
import Footer from "./Footer"

function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/validate-token`), {
  method: 'GET',
  credentials: 'include'
}
      .then((res) => res.json())
      .then((json) => {
        if (json.message === "Success") {
          setAuthenticated(true);
        }
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <body>
      <Navigation />
      {authenticated && <h1>protegido2</h1>}
      <Footer />
    </body>
  );
}

export default Dashboard;
