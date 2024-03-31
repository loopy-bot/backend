import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationWxResourceDto {
  @ApiProperty({ description: '资源名称', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: '页码' })
  @IsNumber()
  page: number;

  @ApiProperty({ description: '每页数量' })
  @IsNumber()
  pageSize: number;
}
