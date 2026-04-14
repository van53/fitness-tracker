import { Injectable, NotFoundException } from '@nestjs/common';
import type { Workout } from './workout.interface';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  private workouts: Workout[] = [];

  getAllWorkouts(): Workout[] {
    return this.workouts;
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