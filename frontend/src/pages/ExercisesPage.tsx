import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../api/apiClient';

const exerciseSchema = z.object({
  name: z.string().min(2, 'Мінімум 2 символи'),
  muscleGroup: z.string().min(2, 'Обов\'язкове поле'),
  description: z.string().optional(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description?: string;
}

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
  });

  const fetchExercises = async () => {
    try {
      const response = await apiClient.get<Exercise[]>('/exercises');
      setExercises(response.data);
    } catch (error) {
      console.error('Помилка завантаження вправ:', error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const onSubmit = async (data: ExerciseFormData) => {
    try {
      await apiClient.post('/exercises', data);
      reset();
      fetchExercises();
    } catch (error) {
      console.error('Помилка створення вправи:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/exercises/${id}`);
      fetchExercises();
    } catch (error) {
      console.error('Помилка видалення:', error);
    }
  };

  return (
    <div>
      <h1>Довідник вправ</h1>
      
      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
          <h3>Додати вправу</h3>
          
          <div>
            <input 
              {...register('name')} 
              placeholder="Назва (напр. Віджимання)" 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            />
            {errors.name && <p style={{ color: 'red', margin: '5px 0 0', fontSize: '12px' }}>{errors.name.message}</p>}
          </div>

          <div>
            <input 
              {...register('muscleGroup')} 
              placeholder="Група м'язів (напр. Груди)" 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
            />
            {errors.muscleGroup && <p style={{ color: 'red', margin: '5px 0 0', fontSize: '12px' }}>{errors.muscleGroup.message}</p>}
          </div>

          <div>
            <textarea 
              {...register('description')} 
              placeholder="Опис (необов'язково)" 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' }} 
            />
          </div>

          <button type="submit" style={{ padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Додати до довідника
          </button>
        </form>

        <div style={{ flex: 1 }}>
          <h3>Усі вправи</h3>
          {exercises.length === 0 ? <p>Довідник порожній.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {exercises.map(e => (
                <li key={e.id} style={{ border: '1px solid #ccc', borderRadius: '4px', margin: '0 0 10px 0', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{e.name}</strong> <span style={{ color: '#10b981' }}>[{e.muscleGroup}]</span> <br/>
                    {e.description && <small style={{ color: 'gray' }}>{e.description}</small>}
                  </div>
                  <button onClick={() => handleDelete(e.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
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