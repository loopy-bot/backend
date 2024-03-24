import { IsNumber, IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  name: string;
  @IsNumber()
  count: number;
  @IsString()
  text: string;
  @IsNumber()
  time: number;
}
