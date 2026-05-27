import Navigation from "./Navigation"
import Footer from "./Footer"
import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message);
        return;
      }
      navigate('../dashboard');
    } catch (error) {
      console.error("Network or parsing error:", error);
    }
  };

  return (
    <>
      <Navigation />
      <form
        className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
        onSubmit={handleSubmit}
      >
        <div className="py-3 sm:max-w-xl sm:mx-auto">
          <div className="px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>
              <div className="">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <input name="email" type="text" className="h-10 w-full border-b-2 border-gray-300 text-gray-900" placeholder="Email" />
                  <input name="password" type="password" className="h-10 w-full border-b-2 border-gray-300 text-gray-900" placeholder="Password" />
                  <button type="submit" className="bg-primary-2 text-white rounded-md px-3 py-2 cursor-pointer">Join</button>
                </div>
                {error != "" &&
                  <div className="bg-red-500 text-black px-4 py-2 rounded-xl">{error}</div>
                }
              </div>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </>
  );
}

export default Login;