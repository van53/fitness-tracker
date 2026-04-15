import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { ExercisesPage } from './pages/ExercisesPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Сторінка за замовчуванням (Тренування) */}
          <Route index element={<WorkoutsPage />} /> 
          {/* Сторінка вправ */}
          <Route path="exercises" element={<ExercisesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);