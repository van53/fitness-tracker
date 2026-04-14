import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  durationMin: number;
}