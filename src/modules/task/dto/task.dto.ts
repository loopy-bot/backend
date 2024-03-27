import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty({ description: '任务名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '执行次数' })
  @IsOptional()
  @IsNumber()
  count: number | null;

  @ApiProperty({ description: '任务文案' })
  @IsString()
  text: string;

  @ApiProperty({ description: '定时时间，采用CRON表达式', example: '0 0 * * *：每天的午夜12点执行一次任务。' })
  @IsString()
  time: string;

  @ApiProperty({ description: '描述' })
  @IsOptional()
  @IsString()
  description: string = '';

  constructor(partial: Partial<TaskDto>) {
    Object.assign(this, partial);
  }
}

export class UpdateTaskDto extends TaskDto {
  @ApiProperty({ description: '任务id' })
  @IsString()
  id: string;
}

export class DeleteTaskDto {
  @ApiProperty({ description: '任务id' })
  @IsString()
  id: string;
}

export class GetTaskDetailDto {
  @ApiProperty({ description: '任务id' })
  @IsString()
  id: string;
}

export class ActiveTaskDto {
  @ApiProperty({ description: '任务id' })
  @IsString()
  id: string;
}
