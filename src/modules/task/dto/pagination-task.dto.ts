import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationTaskDto {
  @ApiProperty({ description: '页码' })
  @IsNumber()
  page: number = 1;
  @ApiProperty({ description: '每页数量' })
  @IsNumber()
  pageSize: number = 10;

  @ApiProperty({ description: '开始区间', required: false })
  @IsOptional()
  @IsNumber()
  startTime?: number;

  @ApiProperty({ description: '结束区间', required: false })
  @IsOptional()
  @IsNumber()
  endTime?: number;

  @ApiProperty({ description: '插件名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
