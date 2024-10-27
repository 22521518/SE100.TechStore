import { IsString } from 'class-validator';

export class DeleteFeedbackDto {
  @IsString()
  customer_id: string;
}
