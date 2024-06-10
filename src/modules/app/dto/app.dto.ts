import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({ description: '聊天记录', example: '[{"role":"user","content":"assistant"}]' })
  @IsString()
  @IsOptional()
  session?: string = '你是一个智能助手，用于回答用户问题';

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

export class BindPluginsDto {
  @ApiProperty({ description: '应用ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'ID组', type: Array<string> })
  @IsArray()
  plugins: string[];
}

export class ChatParamsDto {
  @ApiProperty({ description: '应用ID' })
  @IsString()
  id: string;
  @ApiProperty({ description: '问题' })
  @IsString()
  question: string;

  @ApiProperty({ description: '是否开启上网' })
  @IsBoolean()
  @IsOptional()
  use_search?: boolean;
}