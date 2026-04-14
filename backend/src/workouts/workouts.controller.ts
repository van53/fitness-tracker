import { Body, Controller, Get, Param, Post, Patch, Delete, HttpCode } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import type { Workout } from './workout.interface';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  getAll(): Workout[] {
    return this.workoutsService.getAllWorkouts();
  }

  // Ось цей метод шукає по ID
  @Get(':id')
  getOne(@Param('id') id: string): Workout {
    return this.workoutsService.getWorkoutById(id);
  }

  @Post()
  create(@Body() body: CreateWorkoutDto): Workout {
    return this.workoutsService.createWorkout(body);
  }

  // Метод для оновлення
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateWorkoutDto): Workout {
    return this.workoutsService.updateWorkout(id, body);
  }

  // Метод для видалення
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    this.workoutsService.deleteWorkout(id);
  }
}