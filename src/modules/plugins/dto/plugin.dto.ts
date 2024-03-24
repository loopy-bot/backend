import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class PluginDto {
  // 插件名称
  @ApiProperty({ description: '插件名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '插件类型' })
  @IsString()
  type: string;

  @ApiProperty({ description: '插件描述' })
  @IsString()
  description: string;

  @ApiProperty({ description: '插件请求地址' })
  @IsString()
  url: string;

  @ApiProperty({ description: '插件请求方式', example: 'POST' })
  @IsIn(['POST', 'GET'])
  method: 'POST' | 'GET';
}

export class UpdatePluginDto extends PluginDto {
  @ApiProperty({ description: '插件id' })
  @IsString()
  id: string;
}

export class DeletePluginDto {
  @ApiProperty({ description: '插件id' })
  @IsString()
  id: string;
}

export class GetPluginDetailDto {
  @ApiProperty({ description: '插件id' })
  @IsString()
  id: string;
}
