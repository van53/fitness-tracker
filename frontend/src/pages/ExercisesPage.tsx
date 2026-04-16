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
  ListAlt as ListAltIcon, 
  Search as SearchIcon 
} from '@mui/icons-material';
import { apiClient } from '../api/apiClient';

const exerciseSchema = z.object({
  name: z.string().min(2, 'Мінімум 2 символи'),
  muscleGroup: z.string().min(2, 'Вкажіть групу м’язів'),
  description: z.string().optional(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description?: string;
}

// React.memo для карток
const ExerciseItem = React.memo(({ exercise, onDelete }: { exercise: Exercise, onDelete: (id: string) => void }) => (
  <Card sx={{ 
    borderRadius: 3, 
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)', 
    transition: 'all 0.2s',
    '&:hover': { boxShadow: '0px 6px 20px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' } 
  }}>
    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: '20px !important' }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{exercise.name}</Typography>
        <Chip 
          label={exercise.muscleGroup} 
          size="small" 
          sx={{ mt: 1, mb: 1, bgcolor: '#d1fae5', color: '#065f46', fontWeight: 'bold' }} 
        />
        {exercise.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {exercise.description}
          </Typography>
        )}
      </Box>
      <IconButton onClick={() => onDelete(exercise.id)} color="error">
        <DeleteOutlineIcon />
      </IconButton>
    </CardContent>
  </Card>
));

export function ExercisesPage() {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Стан до локального пошуку та пагінації
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
  });

  const fetchExercises = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await apiClient.get<Exercise[]>('/exercises');
      setAllExercises(response.data);
    } catch (error) {
      setApiError('Помилка завантаження довідника.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      await apiClient.post('/exercises', data);
      reset();
      fetchExercises();
    } catch (error) {
      setApiError('Не вдалося додати вправу.');
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/exercises/${id}`);
      fetchExercises();
    } catch (error) {
      setApiError('Помилка видалення.');
    }
  }, [fetchExercises]);

  // Локальная фильтрация и пагинация с помощью useMemo
  const filteredExercises = useMemo(() => {
    return allExercises.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allExercises, searchTerm]);

  const totalPages = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);
  const displayedExercises = filteredExercises.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Сброс сторінки на 1 при вводі тексту в пошук
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>📚 Довідник вправ</Typography>
      
      {apiError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{apiError}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, gap: 4 }}>
        {/* Ліва колонка: Форма */}
        <Box>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Додати вправу</Typography>
              <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2.5}>
                <TextField
                  fullWidth
                  label="Назва вправи"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  fullWidth
                  label="Група м'язів"
                  {...register('muscleGroup')}
                  error={!!errors.muscleGroup}
                  helperText={errors.muscleGroup?.message}
                />
                <TextField
                  fullWidth
                  label="Опис (опціонально)"
                  multiline
                  rows={3}
                  {...register('description')}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="success"
                  size="large"
                  startIcon={<ListAltIcon />}
                  sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
                >
                  Додати до бази
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Права колонка: Список, Пошук, Пагінація */}
        <Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Пошук за назвою або групою м'язів..."
            value={searchTerm}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              },
            }}
            sx={{ mb: 3, bgcolor: 'white', borderRadius: 2 }}
          />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Stack spacing={2}>
                {displayedExercises.map((e) => (
                  <ExerciseItem key={e.id} exercise={e} onDelete={handleDelete} />
                ))}
                
                {displayedExercises.length === 0 && (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    {searchTerm ? 'Вправ не знайдено.' : 'Довідник порожній.'}
                  </Typography>
                )}
              </Stack>

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