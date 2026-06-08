import { useState, useEffect, useCallback } from "react";
import { SquarePen } from "lucide-react";
import { DateRange } from "react-date-range";
import { useTranslation } from "react-i18next";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function AdminReservations() {
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesTemp, setNotesTemp] = useState("");
  const [rescheduleReservation, setRescheduleReservation] = useState(null);

  const [rescheduleDateRange, setRescheduleDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [rescheduleStartTime, setRescheduleStartTime] = useState("09:00");
  const [rescheduleEndTime, setRescheduleEndTime] = useState("17:00");

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const timeSlots = [];
  for (let h = 0; h <= 24; h++) {
    const hh = String(h).padStart(2, "0");
    timeSlots.push(`${hh}:00`);
    if (h < 24) {
      timeSlots.push(`${hh}:30`);
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const [rRes, uRes] = await Promise.all([
        fetch(`${API_URL}/reservations`, { credentials: "include" }).then((r) =>
          r.json()
        ),
        fetch(`${API_URL}/users`, { credentials: "include" }).then((r) =>
          r.json()
        ),
      ]);
      setReservations(Array.isArray(rRes) ? rRes : []);
      setUsers(Array.isArray(uRes) ? uRes : []);
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  }, [API_URL]);

  useEffect(() => {
    let active = true;
    if (active) {
      setTimeout(() => {
        fetchData();
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [fetchData]);

  const updateReservation = async (id, payload) => {
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Update failed");
      }
      setMsg({ text: t("admin.reservations.msg_updated"), isError: false });
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.reservations.confirm_delete"))) return;
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Delete failed");
      }
      setMsg({ text: t("admin.reservations.msg_deleted"), isError: false });
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleEditSchedule = (r) => {
    setRescheduleReservation(r);
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);

    setRescheduleDateRange([
      {
        startDate: start,
        endDate: end,
        key: "selection",
      },
    ]);

    const startHH = String(start.getHours()).padStart(2, "0");
    const startMM = String(start.getMinutes()).padStart(2, "0");
    setRescheduleStartTime(`${startHH}:${startMM}`);

    const endHH = String(end.getHours()).padStart(2, "0");
    const endMM = String(end.getMinutes()).padStart(2, "0");
    setRescheduleEndTime(`${endHH}:${endMM}`);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!rescheduleReservation) return;

    const finalStart = new Date(rescheduleDateRange[0].startDate);
    const [startH, startM] = rescheduleStartTime.split(":").map(Number);
    finalStart.setHours(startH, startM, 0, 0);

    const finalEnd = new Date(rescheduleDateRange[0].endDate);
    const [endH, endM] = rescheduleEndTime.split(":").map(Number);
    finalEnd.setHours(endH, endM, 0, 0);

    await updateReservation(rescheduleReservation._id, {
      startDate: finalStart,
      endDate: finalEnd,
    });
    setRescheduleReservation(null);
  };

  const statusLabel = {
    0: t("reservations.status.pending"),
    1: t("reservations.status.cancelled"),
    2: t("reservations.status.confirmed"),
    3: t("reservations.status.finished"),
  };

  const filteredReservations = reservations.filter((r) =>
    filterStatus === "all" ? true : String(r.status) === filterStatus
  );

  const formatDate = (dStr) => {
    return new Date(dStr).toLocaleDateString(undefined, {
      year: "2-digit",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-stone-900">{t("admin.reservations.title")}</h1>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white rounded-md px-3 py-2 border border-stone-200 shadow-sm text-sm text-stone-700 h-fit outline-none cursor-pointer focus:border-stone-400"
        >
          {["all", "0", "2", "3", "1"].map((status) => (
            <option key={status} value={status}>
              {status === "all" ? t("admin.reservations.all_statuses") : statusLabel[status]}
            </option>
          ))}
        </select>
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

      <div className="overflow-x-auto bg-white border border-stone-200 rounded-2xl shadow-sm">
        <table className="w-full border-collapse text-left text-xs text-stone-700">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              {[
                t("admin.reservations.table_space"),
                t("admin.reservations.table_client"),
                t("admin.reservations.table_schedule"),
                t("admin.reservations.table_cost"),
                t("admin.reservations.table_status"),
                t("admin.reservations.table_notes"),
                t("admin.reservations.table_actions"),
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-2 font-semibold text-[10px] ${
                    i === 6 ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filteredReservations.map((r) => {
              const client = users.find((u) => u._id === r.reservedBy);
              return (
                <tr
                  key={r._id}
                  className="hover:bg-stone-50/50 transition-colors"
                >
                  <td className="px-4 py-2 font-medium">
                    {r.spaceId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    <div>{client?.name || "N/A"}</div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {client?.email || r.reservedBy}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-mono">{formatDate(r.startDate)}</div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      to {formatDate(r.endDate)}
                    </div>
                  </td>
                  <td className="px-4 py-2 font-mono font-medium">
                    {r.cost?.toFixed(2)}€
                  </td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      r.status === 0
                        ? "text-amber-700"
                        : r.status === 2
                        ? "text-green-700"
                        : r.status === 3
                        ? "text-stone-600"
                        : "text-red-700"
                    }`}
                  >
                    {statusLabel[r.status]}
                  </td>
                  <td className="px-4 py-2">
                    {editingNotesId === r._id ? (
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="text"
                          value={notesTemp}
                          onChange={(e) => setNotesTemp(e.target.value)}
                          className="px-2 py-0.5 border border-stone-300 rounded text-xs focus:outline-none focus:border-stone-400"
                        />
                        <button
                          onClick={() => {
                            updateReservation(r._id, {
                              internalObs: notesTemp,
                            });
                            setEditingNotesId(null);
                          }}
                          className="text-stone-700 hover:underline font-bold"
                        >
                          {t("admin.reservations.notes_save")}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 max-w-[140px] truncate">
                        <span className="text-stone-600">
                          {r.internalObs || "—"}
                        </span>
                        <button
                          onClick={() => {
                            setEditingNotesId(r._id);
                            setNotesTemp(r.internalObs || "");
                          }}
                          className="text-[10px] text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          <SquarePen size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    {r.status === 0 && (
                      <>
                        <button
                          onClick={() => updateReservation(r._id, { status: 2 })}
                          className="text-emerald-600 hover:underline cursor-pointer"
                        >
                          {t("admin.reservations.action_confirm")}
                        </button>
                        <button
                          onClick={() => updateReservation(r._id, { status: 1 })}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          {t("admin.reservations.action_reject")}
                        </button>
                      </>
                    )}
                    {r.status === 2 && (
                      <>
                        <button
                          onClick={() => updateReservation(r._id, { status: 3 })}
                          className="text-stone-600 hover:underline cursor-pointer"
                        >
                          {t("admin.reservations.action_finish")}
                        </button>
                        <button
                          onClick={() => updateReservation(r._id, { status: 1 })}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          {t("admin.reservations.action_cancel")}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEditSchedule(r)}
                      className="text-stone-700 hover:underline font-medium cursor-pointer"
                    >
                      {t("admin.reservations.action_reschedule")}
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-655 hover:underline font-bold cursor-pointer"
                    >
                      {t("admin.reservations.action_delete")}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-stone-400">
                  {t("admin.reservations.no_reservations")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rescheduleReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveSchedule}
            className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center"
          >
            <div className="w-full">
              <h3 className="text-lg font-bold text-stone-900">
                {t("admin.reservations.reschedule_title")}
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                {t("admin.reservations.reschedule_subtitle")}
                <span className="font-bold text-stone-750">
                  {rescheduleReservation.spaceId?.name || "N/A"}
                </span>
              </p>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden shadow-inner flex justify-center bg-white p-2">
              <DateRange
                ranges={rescheduleDateRange}
                onChange={(item) => setRescheduleDateRange([item.selection])}
                months={1}
                direction="horizontal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  {t("admin.reservations.start_time")}
                </label>
                <select
                  value={rescheduleStartTime}
                  onChange={(e) => setRescheduleStartTime(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 cursor-pointer"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  {t("admin.reservations.end_time")}
                </label>
                <select
                  value={rescheduleEndTime}
                  onChange={(e) => setRescheduleEndTime(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 border border-stone-200 shadow-sm text-sm text-stone-850 outline-none focus:border-primary-2 cursor-pointer"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 w-full">
              <button
                type="button"
                onClick={() => setRescheduleReservation(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs cursor-pointer"
              >
                {t("admin.common.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-2 text-white font-bold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                {t("admin.reservations.save_schedule_btn")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminReservations;
