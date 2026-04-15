import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
        <h2>🏋️ Фітнес Трекер</h2>
        
        <nav style={{ display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold' }}>
            Тренування
          </Link>
          <Link to="/exercises" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold' }}>
            Вправи
          </Link>
        </nav>
      </header>
      
      <main>
        {/* Компонент Outlet — це "вікно", куди React Router буде підставляти вміст сторінок */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default App;