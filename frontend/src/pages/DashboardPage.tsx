import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Box } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { apiClient } from '../api/apiClient';

// Кастомний стиль для карток, що додає тонку тінь та м'яке закруглення
const cardStyle = {
  textAlign: 'center',
  p: 2,
  borderRadius: 4, // М'якші кути
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Легка сучасна тінь
  border: '1px solid',
  borderColor: 'divider', // Використовуємо колір divider з теми
  transition: 'transform 0.2s, box-shadow 0.2s', // Плавний ефект при наведенні
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)',
  },
};

export function DashboardPage() {
  const [stats, setStats] = useState({ workouts: 0, exercises: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [workoutsRes, exercisesRes] = await Promise.all([
          apiClient.get('/workouts'),
          apiClient.get('/exercises')
        ]);
        setStats({
          workouts: workoutsRes.data.length,
          exercises: exercisesRes.data.length
        });
      } catch (error) {
        console.error('Помилка завантаження статистики', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
        📊 Статистика Фітнес Трекера
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
        Ласкаво просимо! Ваш шлях до здоров'я та сили починається тут.
      </Typography>

      {/* Надійна та адаптивна сітка на Box з CSS Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 4,
        mt: 2,
      }}>
        
        <Card sx={cardStyle}>
          <CardContent sx={{ p: '24px !important' }}> {/* Додатковий простір всередині */}
            <FitnessCenterIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mt: 2, color: 'text.secondary' }}>Виконано тренувань</Typography>
            <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
              {stats.workouts}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={cardStyle}>
          <CardContent sx={{ p: '24px !important' }}>
            <FormatListBulletedIcon sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
            <Typography variant="h5" sx={{ mt: 2, color: 'text.secondary' }}>Вправ у довіднику</Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mt: 1, color: '#10b981' }}>
              {stats.exercises}
            </Typography>
          </CardContent>
        </Card>

      </Box>
    </Container>
  );
}