import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'; // Додайте CssBaseline
import App from './App';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { DashboardPage } from './pages/DashboardPage';
// import './index.css'; // Видалимо старий CSS для чистоти MUI

// Налаштування сучасної теми з шрифтом Inter
const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter', // Сучасний шрифт
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    background: {
      default: '#f8fafc', // Світлий, приємний фон для всієї сторінки
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/* Обертаємо в ThemeProvider */}
      <CssBaseline /> {/* CssBaseline нормалізує CSS та застосовує колір фону default з палітри */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<DashboardPage />} />
            <Route path="workouts" element={<WorkoutsPage />} /> 
            <Route path="exercises" element={<ExercisesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);