import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.workoutsService.getAllWorkouts(
      page ? Number(page) : 1,
      limit ? Number(limit) : 5,
      search || ''
    );
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.workoutsService.getWorkoutById(id);
  }

  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutsService.createWorkout(createWorkoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutsService.deleteWorkout(id);
  }
}