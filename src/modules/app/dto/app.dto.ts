import { IsOptional, IsString } from 'class-validator';

export class AppDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  model?: string = 'qwen';

  @IsString()
  @IsOptional()
  personality?: string = '你是一个智能助手，用于回答用户问题';

  constructor(app: AppDto) {
    Object.assign(this, app);
  }
}
