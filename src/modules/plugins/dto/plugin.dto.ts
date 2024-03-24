import { IsOptional, IsString } from 'class-validator';

export class PluginDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  url: string;
}
