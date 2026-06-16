import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

function SignUp() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Ocorreu um erro no registo.");
        return;
      }

      navigate('../dashboard');
    } catch (err) {
      console.error("Network or parsing error:", err);
      setError("Erro de rede. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
      onSubmit={handleSubmit}
    >
      <div className="py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-8">{t('auth.create_account')}</h1>

            <div className="text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <input name="email" type="email" className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500" placeholder={t('auth.email')} required />
              <input name="password" type="password" className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500" placeholder={t('auth.password')} required minLength="8" />
              <input name="name" type="text" className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500" placeholder={t('auth.name')} required />
              <input name="contact" type="tel" className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500" placeholder={t('auth.contact')} required />
              <input name="address" type="text" className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500" placeholder={t('auth.address')} required />
              <input name="nif" type="text" className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500" placeholder={t('auth.nif')} required pattern="\d{9}" title="O NIF deve conter 9 dígitos" />

              <input
                name="activity"
                type="text"
                className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                placeholder={`${t('auth.activity')} (${t('auth.optional')})`}
              />

              <input
                name="company"
                type="text"
                className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
                placeholder={`${t('auth.company')} (${t('auth.optional')})`}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? '...' : t('auth.create_account')}
              </Button>
            </div>

            {error && (
              <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default SignUp;
