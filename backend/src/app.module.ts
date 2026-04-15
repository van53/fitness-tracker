import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkoutsModule } from './workouts/workouts.module';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [WorkoutsModule, ExercisesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
