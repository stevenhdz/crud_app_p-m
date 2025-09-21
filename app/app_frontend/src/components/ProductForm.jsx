import { useEffect, useState } from 'react';
import api from '../api/client';

const empty = { name: '', description: '', price: 0, countInStock: 0 };

export default function ProductForm({ editing, onSaved }) {
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { setForm(editing || empty); }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError(''); setMsg('');
      if (editing && editing.id) {
        await api.put(`/products/${editing.id}`, form);
        setMsg('Producto actualizado con éxito');
      } else {
        await api.post('/products', form);
        setMsg('Producto creado con éxito');
      }
      setForm(empty);
      onSaved();
    } catch (e) {
      setError('No se pudo guardar. Revisa los datos.');
    }
  };

  return (
    <section className="card">
      <h2>{editing?.id ? 'Editar' : 'Agregar'} producto</h2>
      {msg && <div className="success">{msg}</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit} className="controls">
        <input placeholder="Nombre" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={150} />
        <input placeholder="Descripción" value={form.description || ''}
          onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="number" step="0.01" placeholder="Precio" value={form.price}
          onChange={e => setForm({ ...form, price: Number(e.target.value) })} required />
        <input type="number" placeholder="Stock" value={form.countInStock}
          onChange={e => setForm({ ...form, countInStock: Number(e.target.value) })} required />
        <button type="submit">Guardar</button>
      </form>
    </section>
  );
}
