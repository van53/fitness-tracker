import { Injectable, NotFoundException } from '@nestjs/common';
import type { Workout } from './workout.interface';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  private workouts: Workout[] = [];

  getAllWorkouts(page: number = 1, limit: number = 5, search: string = '') {
    let result = this.workouts;

    // 1. Фільтрація
    if (search) {
      result = result.filter(w => 
        w.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 2. Пагінація
    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  getWorkoutById(id: string): Workout {
    const workout = this.workouts.find(w => w.id === id);
    if (!workout) {
      throw new NotFoundException(`Тренування з ID ${id} не знайдено`);
    }
    return workout;
  }

  createWorkout(dto: CreateWorkoutDto): Workout {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      title: dto.title,
      date: new Date().toISOString(),
      durationMin: dto.durationMin,
    };
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  updateWorkout(id: string, dto: UpdateWorkoutDto): Workout {
    const workout = this.getWorkoutById(id);
    const updatedWorkout = { ...workout, ...dto };
    
    this.workouts = this.workouts.map(w => w.id === id ? updatedWorkout : w);
    return updatedWorkout;
  }

  deleteWorkout(id: string): void {
    this.getWorkoutById(id);
    this.workouts = this.workouts.filter(w => w.id !== id);
  }
}