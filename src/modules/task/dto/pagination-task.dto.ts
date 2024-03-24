import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationTaskDto {
  @IsNumber()
  page: number = 1;
  @IsNumber()
  pageSize: number = 10;

  @IsOptional()
  @IsNumber()
  startTime?: number;
  @IsOptional()
  @IsNumber()
  endTime?: number;
  @IsOptional()
  @IsString()
  name?: string;
}
