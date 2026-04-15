import { Injectable, NotFoundException } from '@nestjs/common';
import type { Exercise } from './exercise.interface';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  private exercises: Exercise[] = [];

  getAllExercises(): Exercise[] {
    return this.exercises;
  }

  getExerciseById(id: string): Exercise {
    const exercise = this.exercises.find(e => e.id === id);
    if (!exercise) {
      throw new NotFoundException(`Вправу з ID ${id} не знайдено`);
    }
    return exercise;
  }

  createExercise(dto: CreateExerciseDto): Exercise {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: dto.name,
      description: dto.description,
      muscleGroup: dto.muscleGroup,
    };
    this.exercises.push(newExercise);
    return newExercise;
  }

  updateExercise(id: string, dto: UpdateExerciseDto): Exercise {
    const exercise = this.getExerciseById(id);
    const updatedExercise = { ...exercise, ...dto };
    
    this.exercises = this.exercises.map(e => e.id === id ? updatedExercise : e);
    return updatedExercise;
  }

  deleteExercise(id: string): void {
    this.getExerciseById(id);
    this.exercises = this.exercises.filter(e => e.id !== id);
  }
}