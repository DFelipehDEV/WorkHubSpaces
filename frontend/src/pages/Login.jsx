import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

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
      login(); 
      navigate('../dashboard');
    } catch (error) {
      console.error("Network or parsing error:", error);
    }
  };

  return (
    <form
      className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
      onSubmit={handleSubmit}
    >
      <div className="py-3 sm:max-w-xl sm:mx-auto">
        <div className="px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">{t('auth.login')}</h1>
            </div>
            <div className="">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <input name="email" type="text" className="h-10 w-full border-b-2 border-gray-300 text-gray-900" placeholder={t('auth.email')} />
                <input name="password" type="password" className="h-10 w-full border-b-2 border-gray-300 text-gray-900" placeholder={t('auth.password')} />
                <button type="submit" className="bg-primary-2 text-white rounded-md px-3 py-2 cursor-pointer">{t('auth.login')}</button>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4 text-sm">
                <Link to="/signup" className="cursor-pointer text-blue-500 hover:underline">
                  {t('auth.create_account')}
                </Link>
                <Link to="/forgot-password" className="cursor-pointer text-stone-550 hover:underline">
                  {t('auth.forgot_password_link')}
                </Link>
              </div>
              {error != "" &&
                <div className="bg-red-500 text-black px-4 py-2 rounded-xl">{error}</div>
              }
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Login;
