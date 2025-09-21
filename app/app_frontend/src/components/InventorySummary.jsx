import { useEffect, useState } from 'react';
import api from '../api/client';

export default function InventorySummary() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    (async () => {
      try {
        setError('');
        const { data } = await api.get('/products/inventory/summary');
        setData(data);
      } catch (e) {
        setError('No se pudo cargar el resumen.');
      }
    })();
  }, []);

  return (
    <section className="card">
      <h2>Resumen de Inventario</h2>
      {error && <div className="error">{error}</div>}
      {!data ? (<div>Cargando…</div>) : (
        <>
          <h3>Valor total: {Number(data.totalInventoryValue).toFixed(2)}</h3>
          {data.topInventoryProduct && (
            <p>Producto con mayor valor: <strong>{data.topInventoryProduct.name}</strong>
              {' '}({Number(data.topInventoryProduct.price).toFixed(2)} × {data.topInventoryProduct.countInStock})</p>
          )}
        </>
      )}
    </section>
  );
}
