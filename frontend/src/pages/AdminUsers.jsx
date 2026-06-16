import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Spinner from "../components/Spinner";

function AdminUsers() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/users`, { credentials: "include" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    let active = true;
    if (active) {
      setTimeout(() => {
        fetchUsers();
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [fetchUsers]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActiveUser((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const payload = { ...activeUser };
    delete payload._id;
    delete payload.__v;
    delete payload.role;

    try {
      const res = await fetch(`${API_URL}/users/${activeUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update client.");
      }

      setMsg({ text: t("admin.users.msg_updated"), isError: false });
      setActiveUser(null);
      fetchUsers();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.users.confirm_delete"))) return;
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete client.");
      }

      setMsg({ text: t("admin.users.msg_deleted"), isError: false });
      fetchUsers();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleOpenHistory = async (userObj) => {
    setSelectedUser(userObj);
    setUserHistory([]);
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/${userObj._id}/reservations`, {
        credentials: "include",
      });
      const data = await res.json();
      setUserHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusLabel = {
    0: t("reservations.status.pending"),
    1: t("reservations.status.cancelled"),
    2: t("reservations.status.confirmed"),
    3: t("reservations.status.finished"),
  };

  const fields = [
    { name: "name", label: t("admin.users.field_name"), type: "text", required: true },
    { name: "email", label: t("admin.users.field_email"), type: "email", required: true },
    { name: "contact", label: t("admin.users.field_contact"), type: "text", required: true },
    { name: "address", label: t("admin.users.field_address"), type: "text", required: true },
    { name: "nif", label: t("admin.users.field_nif"), type: "text", required: true },
    { name: "activity", label: t("admin.users.field_activity"), type: "text" },
    { name: "company", label: t("admin.users.field_company"), type: "text" },
    { name: "suspended", label: t("admin.users.field_suspended"), type: "checkbox" },
  ];

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <Spinner fullPage />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <PageTitle className="text-2xl! mb-0!">{t("admin.users.title")}</PageTitle>
        {activeUser && (
          <button
            onClick={() => setActiveUser(null)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs transition-all cursor-pointer"
          >
            {t("admin.common.discard")}
          </button>
        )}
      </div>

      {msg && (
        <div
          className={`p-3 rounded-xl border text-xs mb-4 ${
            msg.isError
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-green-50 text-green-700 border-green-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      {activeUser && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm mb-6 space-y-3"
        >
          <h3 className="text-base font-bold text-stone-855">
            {t("admin.users.edit_title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => {
              const inputClass =
                "w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400";
              if (f.type === "checkbox") {
                return (
                  <div key={f.name} className="flex items-center py-1 md:col-span-2">
                    <input
                      type="checkbox"
                      id={f.name}
                      name={f.name}
                      checked={!!activeUser[f.name]}
                      onChange={onChange}
                      className="h-4 w-4 rounded border-stone-300 text-stone-700 mr-2 cursor-pointer"
                    />
                    <label
                      htmlFor={f.name}
                      className="text-xs font-semibold text-stone-600 select-none cursor-pointer"
                    >
                      {f.label}
                    </label>
                  </div>
                );
              }
              return (
                <div key={f.name}>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    required={f.required}
                    value={activeUser[f.name] || ""}
                    onChange={onChange}
                    className={inputClass}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveUser(null)}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs transition-all cursor-pointer"
            >
              {t("admin.common.discard")}
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-primary-2 text-white font-bold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              {t("admin.common.save_changes")}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white border border-stone-200 rounded-2xl shadow-sm">
        <table className="w-full border-collapse text-left text-xs text-stone-700">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2 font-semibold text-[10px]">
                {t("admin.users.table_name")}
              </th>
              <th className="px-4 py-2 font-semibold text-[10px]">
                {t("admin.users.table_email")}
              </th>
              <th className="px-4 py-2 font-semibold text-[10px]">
                {t("admin.users.table_contact")}
              </th>
              <th className="px-4 py-2 font-semibold text-[10px]">
                {t("admin.users.table_nif")}
              </th>
              <th className="px-4 py-2 font-semibold text-[10px]">
                {t("admin.users.table_status")}
              </th>
              <th className="px-4 py-2 font-semibold text-[10px] text-right">
                {t("admin.users.table_actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.contact}</td>
                <td className="px-4 py-2 font-mono">{u.nif}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.suspended
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {u.suspended ? t("admin.users.status_suspended") : t("admin.users.status_active")}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-3">
                  <button
                    onClick={() => handleOpenHistory(u)}
                    className="text-stone-755 hover:underline cursor-pointer font-medium"
                  >
                    {t("admin.users.action_history")}
                  </button>
                  <button
                    onClick={() => setActiveUser({ ...u })}
                    className="text-stone-900 hover:underline font-bold cursor-pointer"
                  >
                    {t("admin.users.action_edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-600 hover:underline cursor-pointer"
                  >
                    {t("admin.users.action_delete")}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-stone-400">
                  {t("admin.users.no_users")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-4">
                {t("admin.users.history_title", { name: selectedUser.name })}
              </h3>
              <div className="overflow-y-auto max-h-[50vh] border border-stone-200 rounded-xl">
                {historyLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner className="h-6 w-6 border-stone-800" />
                  </div>
                ) : userHistory.length === 0 ? (
                  <p className="p-4 text-xs text-stone-500 text-center">
                    {t("admin.users.history_no_bookings")}
                  </p>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2 font-semibold">
                          {t("admin.users.history_table_space")}
                        </th>
                        <th className="px-3 py-2 font-semibold">
                          {t("admin.users.history_table_schedule")}
                        </th>
                        <th className="px-3 py-2 font-semibold">
                          {t("admin.users.history_table_cost")}
                        </th>
                        <th className="px-3 py-2 font-semibold">
                          {t("admin.users.history_table_status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {userHistory.map((h) => (
                        <tr key={h._id}>
                          <td className="px-3 py-2 font-medium">
                            {h.spaceId.name}
                          </td>
                          <td className="px-3 py-2">
                            <div>{formatDate(h.startDate)}</div>
                            <div className="text-[10px] text-stone-400">
                              to {formatDate(h.endDate)}
                            </div>
                          </td>
                          <td className="px-3 py-2 font-mono">
                            {h.cost?.toFixed(2)}€
                          </td>
                          <td className="px-3 py-2 font-semibold">
                            {statusLabel[h.status] || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-4 mt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs cursor-pointer"
              >
                {t("admin.users.close_btn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;