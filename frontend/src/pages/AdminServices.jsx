import { useState, useEffect, useCallback } from 'react';

function AdminServices() {
  const [services, setServices] = useState([]);
  const [msg, setMsg] = useState(null);
  const [activeService, setActiveService] = useState(null); // null (closed) or service object

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/extraservices`, { credentials: 'include' });
      const json = await res.json();
      setServices(Array.isArray(json) ? json : []);
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  }, [API_URL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActiveService(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (service) => setActiveService({ ...service });

  const handleCreateNew = () => setActiveService({ name: '', price: 5, description: '', available: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const isEdit = !!activeService._id;
    const payload = { ...activeService };
    delete payload._id;
    delete payload.__v;
    payload.price = Number(payload.price);

    try {
      const res = await fetch(`${API_URL}/extraservices${isEdit ? `/${activeService._id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Operation failed');
      }
      setMsg({ text: isEdit ? 'Service updated!' : 'Service created!', isError: false });
      setActiveService(null);
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/extraservices/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Delete failed');
      }
      setMsg({ text: 'Service deleted!', isError: false });
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const fields = [
    { name: 'name', label: 'Service Name', type: 'text', required: true },
    { name: 'price', label: 'Price (€)', type: 'number', required: true, min: 0 },
    { name: 'description', label: 'Description', type: 'textarea', colSpan: 2, rows: 2 },
    { name: 'available', label: 'Available', type: 'checkbox', colSpan: 2 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-stone-900">Services Admin</h1>
        <button
          onClick={() => activeService ? setActiveService(null) : handleCreateNew()}
          className="px-3 py-1.5 bg-primary-2 text-white font-bold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          {activeService ? 'Cancel' : 'New Service'}
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl border text-xs mb-4 ${msg.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {activeService && (
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm mb-4 space-y-3">
          <h3 className="text-base font-bold text-stone-855">{activeService._id ? 'Edit Service' : 'New Service'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map(f => {
              const span = f.colSpan === 2 ? 'md:col-span-2' : '';
              const inputClass = "w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400";
              if (f.type === 'checkbox') {
                return (
                  <div key={f.name} className={`${span} flex items-center py-1`}>
                    <input type="checkbox" id={f.name} name={f.name} checked={!!activeService[f.name]} onChange={onChange} className="h-4 w-4 rounded border-stone-300 text-stone-700 mr-2 cursor-pointer" />
                    <label htmlFor={f.name} className="text-xs font-semibold text-stone-600 select-none cursor-pointer">{f.label}</label>
                  </div>
                );
              }
              return (
                <div key={f.name} className={span}>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea name={f.name} rows={f.rows} value={activeService[f.name] || ''} onChange={onChange} className={inputClass} />
                  ) : (
                    <input type={f.type} name={f.name} required={f.required} min={f.min} value={activeService[f.name] ?? (f.type === 'number' ? 5 : '')} onChange={onChange} className={inputClass} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setActiveService(null)} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs transition-all cursor-pointer">Discard</button>
            <button type="submit" className="px-3 py-1.5 bg-primary-2 text-white font-bold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">{activeService._id ? 'Save Changes' : 'Create Service'}</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white border border-stone-200 rounded-2xl shadow-sm">
        <table className="w-full border-collapse text-left text-xs text-stone-700">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              {['Service', 'Description', 'Price', 'Status', 'Actions'].map((h, i) => (
                <th key={h} className={`px-4 py-2 font-semibold text-[10px] ${i === 4 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {services.map(s => (
              <tr key={s._id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2 text-stone-500 max-w-[240px] truncate">{s.description || '—'}</td>
                <td className="px-4 py-2 font-mono font-medium">{s.price?.toFixed(2)}€</td>
                <td className={`px-4 py-2 font-semibold ${s.available
                    ? 'text-green-700'
                    : 'text-stone-600'
                  }`}>
                  {s.available ? 'Active' : 'Inactive'}
                </td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => handleEdit(s)} className="text-stone-700 hover:underline mr-3 cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-stone-400">No extra services found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminServices;
