import { useState } from 'react';
import api from '../api/client';

export default function BudgetCombos() {
  const [budget, setBudget] = useState(10);
  const [combos, setCombos] = useState([]);
  const [error, setError] = useState('');

  const query = async () => {
    try {
      setError('');
      const { data } = await api.get('/products/combos', { params: { budget } });
      setCombos(data);
    } catch (e) {
      setError('No se pudo obtener combinaciones.');
    }
  };

  return (
    <section className="card">
      <h2>Combinaciones por presupuesto</h2>
      <div className="controls">
        <input type="number" step="0.01" value={budget} onChange={e => setBudget(e.target.value)} />
        <button onClick={query}>Calcular</button>
      </div>
      {error && <div className="error">{error}</div>}
      <ul>
        {combos.map((c, idx) => (
          <li key={idx}>{c.slice(0, c.length - 1).join(' + ')} = {Number(c[c.length - 1]).toFixed(2)}</li>
        ))}
        {combos.length === 0 && <li>Sin combinaciones</li>}
      </ul>
    </section>
  );
}
