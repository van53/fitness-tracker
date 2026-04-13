import { Injectable } from '@nestjs/common';
import { Workout } from './workout.interface';

@Injectable()
export class WorkoutsService {
  // In-memory сховище
  private workouts: Workout[] = [];

  getAllWorkouts(): Workout[] {
    return this.workouts;
  }

  createWorkout(title: string, durationMin: number): Workout {
    const newWorkout: Workout = {
      id: Date.now().toString(), // Проста генерація ID
      title,
      date: new Date().toISOString(),
      durationMin,
    };
    this.workouts.push(newWorkout);
    return newWorkout;
  }
}