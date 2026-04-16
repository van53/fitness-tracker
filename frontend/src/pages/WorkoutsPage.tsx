import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Container, Typography, Box, TextField, Button, Card, 
  CardContent, IconButton, CircularProgress, Alert, Stack, Chip, Pagination
} from '@mui/material';
import { 
  DeleteOutlined as DeleteOutlineIcon, 
  AddCircleOutlined as AddCircleOutlineIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { apiClient } from '../api/apiClient';

const workoutSchema = z.object({
  title: z.string().min(3, 'Мінімум 3 символи'),
  durationMin: z.number().min(1, 'Мінімум 1 хв'),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

interface Workout { 
  id: string; 
  title: string; 
  date: string; 
  durationMin: number; 
}

const WorkoutItem = React.memo(({ workout, onDelete }: { workout: Workout, onDelete: (id: string) => void }) => (
  <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 12px rgba(0,0,0,0.05)', mb: 2 }}>
    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        {/* ВИПРАВЛЕНО ТУТ: fontWeight перенесено в sx */}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {workout.title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
          <Chip label={`${workout.durationMin} хв`} size="small" color="primary" />
          <Typography variant="caption" color="text.secondary">
            {new Date(workout.date).toLocaleDateString()}
          </Typography>
        </Stack>
      </Box>
      <IconButton onClick={() => onDelete(workout.id)} color="error">
        <DeleteOutlineIcon />
      </IconButton>
    </CardContent>
  </Card>
));

export function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { register, handleSubmit, reset } = useForm<WorkoutFormData>({ resolver: zodResolver(workoutSchema) });

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchTerm); setPage(1); }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchWorkouts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/workouts?page=${page}&limit=4&search=${debouncedSearch}`);
      
      const fetchedData = response.data.data ? response.data.data : response.data;

      if (Array.isArray(fetchedData)) {
        setWorkouts(fetchedData);
      } else {
        setWorkouts([]); 
      }

      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Помилка завантаження', error);
      setWorkouts([]); 
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchWorkouts(); }, [fetchWorkouts]);

  const handleDelete = useCallback(async (id: string) => {
    await apiClient.delete(`/workouts/${id}`);
    fetchWorkouts();
  }, [fetchWorkouts]);

  const onSubmit = async (data: WorkoutFormData) => {
    await apiClient.post('/workouts', data);
    reset();
    fetchWorkouts();
  };

  const totalDuration = useMemo(() => workouts.reduce((acc, curr) => acc + curr.durationMin, 0), [workouts]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>💪 Тренування</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, gap: 4 }}>
        
        <Box>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Новий запис</Typography>
            <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3}>
              <TextField fullWidth label="Назва" {...register('title')} />
              <TextField fullWidth label="Тривалість (хв)" type="number" {...register('durationMin', { valueAsNumber: true })} />
              <Button type="submit" variant="contained" size="large" startIcon={<AddCircleOutlineIcon />}>Зберегти</Button>
            </Stack>
          </Card>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: '#eff6ff', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#1d4ed8', fontWeight: 'bold' }}>
              Поточна сума часу на сторінці: {totalDuration} хв.
            </Typography>
          </Box>
        </Box>

        <Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Шукати тренування..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              },
            }}
            sx={{ mb: 3, bgcolor: 'white', borderRadius: 2 }}
          />

          {isLoading ? <CircularProgress sx={{ display: 'block', mx: 'auto' }} /> : (
            <>
              {workouts.length === 0 ? <Typography>Нічого не знайдено.</Typography> : workouts.map((w) => (
                <WorkoutItem key={w.id} workout={w} onDelete={handleDelete} />
              ))}
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(_, value) => setPage(value)} 
                    color="primary" 
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}