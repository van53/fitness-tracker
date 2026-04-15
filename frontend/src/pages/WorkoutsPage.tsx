import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../api/apiClient';

// Схема валідації (Zod)
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

export function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // 2. Налаштування React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
  });

  // 3. Функція завантаження даних
  const fetchWorkouts = async () => {
    try {
      const response = await apiClient.get<Workout[]>('/workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Помилка завантаження тренувань:', error);
    }
  };

  // Викликається один раз при завантаженні сторінки
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // 4. Обробник відправки форми
  const onSubmit = async (data: WorkoutFormData) => {
    try {
      await apiClient.post('/workouts', data);
      reset(); // Очищаємо форму після успіху
      fetchWorkouts(); // Оновлюємо список
    } catch (error) {
      console.error('Помилка створення тренування:', error);
    }
  };

  // 5. Обробник видалення
  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/workouts/${id}`);
      fetchWorkouts(); // Оновлюємо список після видалення
    } catch (error) {
      console.error('Помилка видалення:', error);
    }
  };

  return (
    <div>
      <h1>Мої тренування</h1>
      
      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        {/* Блок форми */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
          <h3>Додати нове</h3>
          
          <div>
            <input 
              {...register('title')} 
              placeholder="Назва (напр. Пробіжка)" 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            />
            {errors.title && <p style={{ color: 'red', margin: '5px 0 0', fontSize: '12px' }}>{errors.title.message}</p>}
          </div>

          <div>
            <input 
              {...register('durationMin', { valueAsNumber: true })} 
              type="number" 
              placeholder="Тривалість (хвилини)" 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            />
            {errors.durationMin && <p style={{ color: 'red', margin: '5px 0 0', fontSize: '12px' }}>{errors.durationMin.message}</p>}
          </div>

          <button type="submit" style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Зберегти
          </button>
        </form>

        {/* Блок списку */}
        <div style={{ flex: 1 }}>
          <h3>Історія тренувань</h3>
          {workouts.length === 0 ? <p>Тренувань поки немає.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {workouts.map(w => (
                <li key={w.id} style={{ border: '1px solid #ccc', borderRadius: '4px', margin: '0 0 10px 0', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{w.title}</strong> ({w.durationMin} хв) <br/>
                    <small style={{ color: 'gray' }}>{new Date(w.date).toLocaleString()}</small>
                  </div>
                  <button onClick={() => handleDelete(w.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}