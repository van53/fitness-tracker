import { Body, Controller, Get, Param, Post, Patch, Delete, HttpCode } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import type { Exercise } from './exercise.interface';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  getAll(): Exercise[] {
    return this.exercisesService.getAllExercises();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Exercise {
    return this.exercisesService.getExerciseById(id);
  }

  @Post()
  create(@Body() body: CreateExerciseDto): Exercise {
    return this.exercisesService.createExercise(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateExerciseDto): Exercise {
    return this.exercisesService.updateExercise(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    this.exercisesService.deleteExercise(id);
  }
}