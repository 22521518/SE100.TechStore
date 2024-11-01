import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsOptional()
  feedback_id?: string;

  @IsString()
  customer_id: string;

  @IsString()
  feedback: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  created_at?: Date | string;
}
