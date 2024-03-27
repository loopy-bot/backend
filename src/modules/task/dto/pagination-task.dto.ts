import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationTaskDto {
  @ApiProperty({ description: '页码' })
  @IsNumber()
  page: number = 1;
  @ApiProperty({ description: '每页数量' })
  @IsNumber()
  pageSize: number = 10;

  @ApiProperty({ description: '定时任务名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
