import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import type { Workout } from './workout.interface';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  getAll(): Workout[] {
    return this.workoutsService.getAllWorkouts();
  }

  @Post()
  create(@Body() body: { title: string; durationMin: number }): Workout {
    return this.workoutsService.createWorkout(body.title, body.durationMin);
  }
}