import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Container, Typography, Box, TextField, Button, Card, 
  CardContent, IconButton, CircularProgress, Alert, Stack, Chip 
} from '@mui/material';
import { DeleteOutlined as DeleteOutlineIcon, AddCircleOutlined as AddCircleOutlineIcon } from '@mui/icons-material';
import { apiClient } from '../api/apiClient';

const workoutSchema = z.object({
  title: z.string().min(3, 'Назва має містити мінімум 3 символи'),
  durationMin: z.number().min(1, 'Мінімум 1 хвилина'),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

interface Workout {
  id: string;
  title: string;
  date: string;
  durationMin: number;
}

const cardStyle = {
  borderRadius: 3,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  border: '1px solid',
  borderColor: 'divider',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.08)',
  },
};

export function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
  });

  const fetchWorkouts = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<Workout[]>('/workouts');
      setWorkouts(response.data);
    } catch (error) {
      setApiError('Не вдалося завантажити дані. Перевірте з’єднання з сервером.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const onSubmit = async (data: WorkoutFormData) => {
    try {
      await apiClient.post('/workouts', data);
      reset();
      fetchWorkouts();
    } catch (error) {
      setApiError('Помилка при створенні тренування.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/workouts/${id}`);
      fetchWorkouts();
    } catch (error) {
      setApiError('Не вдалося видалити запис.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>💪 Мої тренування</Typography>
      
      {apiError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{apiError}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, gap: 4 }}>
        {/* Форма */}
        <Box>
          <Card sx={{ ...cardStyle, p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Новий запис</Typography>
              <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3}>
                <TextField
                  fullWidth
                  label="Назва тренування"
                  variant="outlined"
                  {...register('title')}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
                <TextField
                  fullWidth
                  label="Тривалість (хв)"
                  type="number"
                  variant="outlined"
                  {...register('durationMin', { valueAsNumber: true })}
                  error={!!errors.durationMin}
                  helperText={errors.durationMin?.message}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  startIcon={<AddCircleOutlineIcon />}
                  disabled={isLoading}
                  sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
                >
                  Зберегти
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Список */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>Історія активності</Typography>
          {isLoading && workouts.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>
          ) : (
            <Stack spacing={2}>
              {workouts.map((w) => (
                <Card key={w.id} sx={{ ...cardStyle, '&:hover': { transform: 'translateX(5px)' } }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '16px !important' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{w.title}</Typography>
                      {/**/}
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                        <Chip label={`${w.durationMin} хв`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(w.date).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Box>
                    <IconButton onClick={() => handleDelete(w.id)} color="error" sx={{ bgcolor: 'error.lighter' }}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
              {workouts.length === 0 && <Typography color="text.secondary">Записів поки немає. Час розпочати тренування!</Typography>}
            </Stack>
          )}
        </Box>
      </Box>
    </Container>
  );
}