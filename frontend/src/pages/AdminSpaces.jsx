import { useState, useEffect, useCallback } from 'react';

function AdminSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [msg, setMsg] = useState(null);
  const [activeSpace, setActiveSpace] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchData = useCallback(async () => {
    try {
      const [sRes, tRes] = await Promise.all([
        fetch(`${API_URL}/spaces`).then(r => r.json()),
        fetch(`${API_URL}/spacetypes`).then(r => r.json())
      ]);
      setSpaces(Array.isArray(sRes) ? sRes : []);
      setSpaceTypes(Array.isArray(tRes) ? tRes : []);
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
    setActiveSpace(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (space) => setActiveSpace({ ...space, images: space.images ? space.images.join(', ') : '' });

  const handleCreateNew = () => setActiveSpace({ name: '', type: spaceTypes[0]?._id || '', available: true, description: '', capacity: 10, pricePerHour: 10, images: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const isEdit = !!activeSpace._id;
    const payload = { ...activeSpace };
    delete payload._id;
    delete payload.__v;
    delete payload.reviews;
    delete payload.favoritedBy;
    delete payload.popularity;
    payload.capacity = Number(activeSpace.capacity);
    payload.pricePerHour = Number(activeSpace.pricePerHour);
    payload.images = typeof activeSpace.images === 'string' ? activeSpace.images.split(',').map(i => i.trim()).filter(Boolean) : (activeSpace.images || []);
    try {
      const res = await fetch(`${API_URL}/spaces${isEdit ? `/${activeSpace._id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Operation failed');
      }
      setMsg({ text: isEdit ? 'Space updated!' : 'Space created!', isError: false });
      setActiveSpace(null);
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this space?')) return;
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/spaces/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Delete failed');
      }
      setMsg({ text: 'Space deleted!', isError: false });
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'select', required: true, options: spaceTypes },
    { name: 'capacity', label: 'Capacity (pax)', type: 'number', required: true, min: 1 },
    { name: 'pricePerHour', label: 'Price per Hour (€)', type: 'number', required: true, min: 0 },
    { name: 'images', label: 'Images (comma separated)', type: 'text', colSpan: 2 },
    { name: 'description', label: 'Description', type: 'textarea', colSpan: 2, rows: 2 },
    { name: 'available', label: 'Available for bookings', type: 'checkbox', colSpan: 2 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Spaces Admin</h1>
          <p className="text-xs text-stone-500">Manage all workspace listings</p>
        </div>
        <button
          onClick={() => activeSpace ? setActiveSpace(null) : handleCreateNew()}
          className="px-3 py-1.5 bg-primary-2 text-white font-bold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          {activeSpace ? 'Cancel' : 'New Space'}
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl border text-xs mb-4 ${msg.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {activeSpace && (
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm mb-4 space-y-3">
          <h3 className="text-base font-bold text-stone-855">{activeSpace._id ? 'Edit Space' : 'New Space'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map(f => {
              const span = f.colSpan === 2 ? 'md:col-span-2' : '';
              const inputClass = "w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-stone-400";
              if (f.type === 'checkbox') {
                return (
                  <div key={f.name} className={`${span} flex items-center py-1`}>
                    <input type="checkbox" id={f.name} name={f.name} checked={!!activeSpace[f.name]} onChange={onChange} className="h-4 w-4 rounded border-stone-300 text-stone-700 mr-2 cursor-pointer" />
                    <label htmlFor={f.name} className="text-xs font-semibold text-stone-600 select-none cursor-pointer">{f.label}</label>
                  </div>
                );
              }
              return (
                <div key={f.name} className={span}>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">{f.label}</label>
                  {f.type === 'select' ? (
                    <select name={f.name} required={f.required} value={activeSpace[f.name] || ''} onChange={onChange} className={inputClass}>
                      <option value="" disabled>Select type</option>
                      {f.options.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea name={f.name} rows={f.rows} value={activeSpace[f.name] || ''} onChange={onChange} className={inputClass} />
                  ) : (
                    <input type={f.type} name={f.name} required={f.required} min={f.min} value={activeSpace[f.name] ?? (f.type === 'number' ? 10 : '')} onChange={onChange} className={inputClass} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setActiveSpace(null)} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs transition-all cursor-pointer">Discard</button>
            <button type="submit" className="px-3 py-1.5 bg-primary-2 text-white font-bold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">Save Changes</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white border border-stone-200 rounded-2xl shadow-sm">
        <table className="w-full border-collapse text-left text-xs text-stone-700">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
            <tr>
              {['Space', 'Type', 'Capacity', 'Price', 'Status', 'Actions'].map((h, i) => (
                <th key={h} className={`px-4 py-2 font-semibold text-[10px] ${i === 5 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {spaces.map(s => (
              <tr key={s._id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2">{spaceTypes.find(t => t._id === s.type)?.name}</td>
                <td className="px-4 py-2">{s.capacity} pax</td>
                <td className="px-4 py-2">{s.pricePerHour}€/hr</td>
                <td className="px-4 py-2">{s.available ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => handleEdit(s)} className="text-stone-700 hover:underline mr-3 cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:underline cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
            {spaces.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-stone-400">No workspaces found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminSpaces;
