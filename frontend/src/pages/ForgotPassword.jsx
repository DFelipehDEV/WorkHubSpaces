import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || t("auth.recovery_error"));
        return;
      }

      setMessage(t("auth.recovery_success"));
    } catch {
      setError(t("auth.network_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6">{t("auth.forgot_title")}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder={t("auth.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-2 text-white rounded-md px-3 py-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? t("auth.sending_btn") : t("auth.send_recovery_btn")}
              </button>
            </form>
            <div className="mt-4 flex justify-between text-sm">
              <Link to="/login" className="text-blue-500 hover:underline">
                {t("auth.back_to_login")}
              </Link>
            </div>
            {message && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
