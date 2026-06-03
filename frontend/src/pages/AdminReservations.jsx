import { useState, useEffect, useCallback } from 'react';
import { SquarePen } from 'lucide-react'

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' or '0', '1', '2', '3'
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesTemp, setNotesTemp] = useState('');

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchData = useCallback(async () => {
    try {
      const [rRes, uRes] = await Promise.all([
        fetch(`${API_URL}/reservations`, { credentials: 'include' }).then(r => r.json()),
        fetch(`${API_URL}/users`, { credentials: 'include' }).then(r => r.json())
      ]);
      setReservations(Array.isArray(rRes) ? rRes : []);
      setUsers(Array.isArray(uRes) ? uRes : []);
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  }, [API_URL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const updateReservation = async (id, payload) => {
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Update failed');
      }
      setMsg({ text: 'Reservation updated!', isError: false });
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Delete failed');
      }
      setMsg({ text: 'Reservation deleted!', isError: false });
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const statusLabel = { 0: 'Pending', 1: 'Cancelled', 2: 'Confirmed', 3: 'Finished' };

  const filteredReservations = reservations.filter(r => 
    filterStatus === 'all' ? true : String(r.status) === filterStatus
  );

  const formatDate = (dStr) => {
    return new Date(dStr).toLocaleDateString(undefined, {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-stone-900">Reservations Admin</h1>
        
        <div className="flex bg-stone-100 p-0.5 rounded-lg text-xs font-semibold gap-1">
          {['all', '0', '2', '3', '1'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                filterStatus === status 
                  ? 'bg-white text-stone-900 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-850'
              }`}
            >
              {status === 'all' ? 'All' : statusLabel[status]}
            </button>
          ))}
        </div>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl border text-xs mb-4 ${msg.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="overflow-x-auto bg-white border border-stone-200 rounded-2xl shadow-sm">
        <table className="w-full border-collapse text-left text-xs text-stone-700">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              {['Space', 'Client', 'Schedule', 'Cost', 'Status', 'Internal Notes', 'Actions'].map((h, i) => (
                <th key={h} className={`px-4 py-2 font-semibold text-[10px] ${i === 6 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filteredReservations.map(r => {
              const client = users.find(u => u._id === r.reservedBy);
              return (
                <tr key={r._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-4 py-2 font-medium">{r.spaceId?.name || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <div>{client?.name || 'N/A'}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{client?.email || r.reservedBy}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-mono">{formatDate(r.startDate)}</div>
                    <div className="text-[10px] text-stone-400 font-mono">to {formatDate(r.endDate)}</div>
                  </td>
                  <td className="px-4 py-2 font-mono font-medium">{r.cost?.toFixed(2)}€</td>
                  <td className={`px-4 py-2 font-semibold ${
                      r.status === 0 ? 'text-amber-700' :
                      r.status === 2 ? 'text-green-700' :
                      r.status === 3 ? 'text-stone-600' :
                      'text-red-700'
                    }`}>
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
                            updateReservation(r._id, { internalObs: notesTemp });
                            setEditingNotesId(null);
                          }}
                          className="text-stone-700 hover:underline font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 max-w-[140px] truncate">
                        <span className="text-stone-600">{r.internalObs || '—'}</span>
                        <button
                          onClick={() => {
                            setEditingNotesId(r._id);
                            setNotesTemp(r.internalObs || '');
                          }}
                          className="text-[10px] text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          <SquarePen size={16}/>
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
                          Confirm
                        </button>
                        <button
                          onClick={() => updateReservation(r._id, { status: 1 })}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === 2 && (
                      <>
                        <button
                          onClick={() => updateReservation(r._id, { status: 3 })}
                          className="text-stone-600 hover:underline cursor-pointer"
                        >
                          Finish
                        </button>
                        <button
                          onClick={() => updateReservation(r._id, { status: 1 })}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-650 hover:underline font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-stone-400">No reservations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReservations;
