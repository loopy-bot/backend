import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationWxResourceDto {
  @IsString()
  @IsOptional()
  wxId: string;
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  page: number;
  @IsNumber()
  pageSize: number;
}
