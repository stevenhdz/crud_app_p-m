import { useState } from 'react';
import api from './api/client';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import InventorySummary from './components/InventorySummary';
import BudgetCombos from './components/BudgetCombos';
import MeowModal from './components/MeowModal';
import FooterFact from './components/FooterFact';

function App() {
  const [editing, setEditing] = useState(null);

  const [version, setVersion] = useState(0);
  const refetch = () => setVersion(v => v + 1);
  const onDelete = async (id) => { await api.delete(`/products/${id}`); refetch(); };

  return (
    <div className="App" style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <MeowModal />
      <h1>CRUD Productos (P+M) (SPA) (React) + (Spring Boot)</h1>

      <InventorySummary />
      <ProductForm editing={editing} onSaved={refetch} />
      <ProductTable onEdit={setEditing} onDelete={onDelete} version={version} />
      <BudgetCombos />
      <FooterFact />

    </div>
  );
}

export default App;
