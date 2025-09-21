import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const money = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ProductTable({ onEdit, onDelete, version }) {
  const [rows, setRows] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [asc, setAsc] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      const { data } = await api.get('/products');
      setRows(data);
    } catch (e) {
      setError('No se pudo cargar el listado.');
    }
  };
  useEffect(() => { fetchData(); }, [version]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(p =>
      String(p.name || '').toLowerCase().includes(q) ||
      String(p.description || '').toLowerCase().includes(q)
    );
  }, [rows, query]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = a[sortBy]; const vb = b[sortBy];
      if (typeof va === 'number' && typeof vb === 'number') return asc ? va - vb : vb - va;
      return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return copy;
  }, [filtered, sortBy, asc]);

  const toggleSort = (key) => {
    if (sortBy === key) setAsc(!asc);
    else { setSortBy(key); setAsc(true); }
  };
  const sortIcon = (key) => (sortBy !== key ? '↕' : asc ? '▲' : '▼');

  const confirmDelete = async (id) => {
    const ok = window.confirm('¿Eliminar este producto?');
    if (ok) await onDelete(id);
  };

  return (
    <section className={`card table-card`}>
      <div className="table-header">
        <h2 style={{ margin: 0 }}>Productos</h2>
        <div className="table-tools">
          <input
            className="input"
            placeholder="Buscar por nombre o descripción…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="badge">{sorted.length} resultado{sorted.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {error && <div className="error" style={{ marginBottom: 8 }}>{error}</div>}

      <div className="table-wrapper">
        <table className="nice-table roomy">
          <colgroup>
            <col style={{ minWidth: 180 }} />
            <col style={{ minWidth: 280, width: '45%' }} />
            <col style={{ minWidth: 120 }} />
            <col style={{ minWidth: 100 }} />
            <col style={{ minWidth: 180 }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" aria-sort={sortBy === 'name' ? (asc ? 'ascending' : 'descending') : 'none'} onClick={() => toggleSort('name')}>
                <span>Nombre</span> <em>{sortIcon('name')}</em>
              </th>
              <th><span>Descripción</span></th>
              <th className="sortable" onClick={() => toggleSort('price')}>
                <span>Precio</span> <em>{sortIcon('price')}</em>
              </th>
              <th className="sortable" onClick={() => toggleSort('countInStock')}>
                <span>Stock</span> <em>{sortIcon('countInStock')}</em>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td className="muted description-cell">{p.description}</td>
                <td>{money.format(Number(p.price || 0))}</td>
                <td>
                  <span className={`pill ${p.countInStock > 0 ? 'ok' : 'warn'}`}>
                    {p.countInStock}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button onClick={() => onEdit(p)}>Editar</button>
                    <button className="danger" onClick={() => confirmDelete(p.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  <div>
                    <div className="empty-title">No hay productos</div>
                    <div className="empty-sub">Crea uno nuevo o cambia el filtro.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
