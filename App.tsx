import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StockTake } from './pages/StockTake';
import { Transfers } from './pages/Transfers';
import { Wastage } from './pages/Wastage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/count" element={<StockTake />} />
          <Route path="/transfer" element={<Transfers />} />
          <Route path="/wastage" element={<Wastage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
