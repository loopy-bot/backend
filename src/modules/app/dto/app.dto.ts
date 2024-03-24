import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AppDto {
  @ApiProperty({ description: '应用名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '应用描述' })
  @IsString()
  description: string;

  @ApiProperty({ description: '模型', default: 'qwen' })
  @IsString()
  @IsOptional()
  model?: string = 'qwen';

  @ApiProperty({ description: '个性', example: '你是一个智能助手，用于回答用户问题' })
  @IsString()
  @IsOptional()
  personality?: string = '你是一个智能助手，用于回答用户问题';

  constructor(app: AppDto) {
    Object.assign(this, app);
  }
}

export class UpdateAppDto extends AppDto {
  @ApiProperty({ description: '应用ID' })
  @IsString()
  id: string;
}

export class DeleteAppDto {
  @ApiProperty({ description: '应用ID' })
  @IsString()
  id: string;
}

export class GetAppDetailDto {
  @ApiProperty({ description: '应用ID' })
  @IsString()
  id: string;
}

export class BindFriendsOrPluginsOrRoomsDto {
  @ApiProperty({ description: '应用ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'ID组' })
  @IsString()
  entityIds: string[];
}