import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FrientDto {
  @IsNotEmpty()
  @IsString()
  wxId: string; // 微信id或者备注名称

  @IsNotEmpty()
  @IsString()
  name: string; // 姓名

  @IsOptional()
  @IsString()
  alias: string; // 备注名称
}

export class RoomDto {
  @IsNotEmpty()
  @IsString()
  wxId: string; // 微信id或者备注名称
  @IsNotEmpty()
  @IsString()
  name: string; // 姓名
  @IsNotEmpty()
  @IsNumber()
  memberCount: number; // 群成员数量
}
