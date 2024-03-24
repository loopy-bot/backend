import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty({ description: '任务名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '执行次数' })
  @IsNumber()
  count: number;

  @ApiProperty({ description: '任务文案' })
  @IsString()
  text: string;

  @ApiProperty({ description: '定时时间' })
  @IsNumber()
  time: number;
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

export class BindFriendsOrRoomsDto {
  @ApiProperty({ description: '任务id' })
  @IsString()
  id: string;

  @ApiProperty({ description: '资源id集合' })
  @IsString()
  entityIds: string[];
}

export class ActiveTaskDto {
  @ApiProperty({ description: '任务id' })
  @IsString()
  id: string;
}
