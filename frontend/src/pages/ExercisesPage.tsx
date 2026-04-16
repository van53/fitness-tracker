import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Container, Typography, Box, TextField, Button, Card, 
  CardContent, IconButton, CircularProgress, Alert, Stack, Chip 
} from '@mui/material';
import { DeleteOutlined as DeleteOutlineIcon, ListAlt as ListAltIcon } from '@mui/icons-material';
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

const cardStyle = {
  borderRadius: 3,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  border: '1px solid',
  borderColor: 'divider',
  transition: 'all 0.2s ease-in-out',
};

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
  });

  const fetchExercises = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<Exercise[]>('/exercises');
      setExercises(response.data);
    } catch (error) {
      setApiError('Помилка завантаження довідника.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchExercises(); }, []);

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      await apiClient.post('/exercises', data);
      reset();
      fetchExercises();
    } catch (error) {
      setApiError('Не вдалося додати вправу.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/exercises/${id}`);
      fetchExercises();
    } catch (error) {
      setApiError('Помилка видалення.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>📚 Довідник вправ</Typography>
      
      {apiError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{apiError}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, gap: 4 }}>
        <Box>
          <Card sx={{ ...cardStyle, p: 1 }}>
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

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>Всі вправи</Typography>
          <Stack spacing={2}>
            {exercises.map((e) => (
              <Card key={e.id} sx={{ ...cardStyle, '&:hover': { boxShadow: '0px 6px 20px rgba(0,0,0,0.1)' } }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: '20px !important' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{e.name}</Typography>
                    <Chip label={e.muscleGroup} size="small" sx={{ mt: 1, mb: 1, bgcolor: 'success.lighter', color: 'success.dark', fontWeight: 'bold' }} />
                    {e.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {e.description}
                      </Typography>
                    )}
                  </Box>
                  <IconButton onClick={() => handleDelete(e.id)} color="error">
                    <DeleteOutlineIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}