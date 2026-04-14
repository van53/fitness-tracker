import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateWorkoutDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  durationMin?: number;
}