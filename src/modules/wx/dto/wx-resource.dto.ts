import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FrientDto {
  @ApiProperty({
    description: '微信id或者备注名称',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  wxId: string; // 微信id或者备注名称

  @ApiProperty({
    description: '姓名',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string; // 姓名

  @ApiProperty({
    description: '备注名称',
    type: String,
  })
  @IsOptional()
  @IsString()
  alias: string; // 备注名称
}

export class RoomDto {
  @ApiProperty({
    description: '微信id或者备注名称',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  wxId: string; // 微信id或者备注名称

  @ApiProperty({
    description: '姓名',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string; // 姓名

  @ApiProperty({
    description: '群成员数量',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  memberCount: number; // 群成员数量
}

export class GetFriendDetailDto {
  @ApiProperty({
    description: '微信id或者备注名称',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  id: string; // 微信id或者备注名称
}

export class GetRoomDetailDto {
  @ApiProperty({
    description: '微信id或者备注名称',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  id: string; // 微信id或者备注名称
}

export class MessageDto {
  @ApiProperty({
    description: '多轮对话的key',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  key: string; // 微信id或者备注名称
  @ApiProperty({
    description: '询问的问题',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  question: string; // 微信id或者备注名称
}

export class BindDto {
  @ApiProperty({
    description: '好友或群聊id',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class BindTaskDto extends BindDto {
  @ApiProperty({
    description: '任务id组',
    type: Array<string>,
  })
  @IsNotEmpty()
  @IsArray()
  taskIds: string[]; // 任务id
}

export class BindAppDto extends BindDto {
  @ApiProperty({
    description: '应用id',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  appId: string; // 任务id
}
