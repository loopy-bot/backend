import { Controller, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { App } from './entities/app.entity';
import { AppService } from './app.service';
import { AppDto } from './dto/app.dto';

@Controller('application')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('list')
  async findAll(): Promise<App[]> {
    return this.appService.findAll();
  }

  @Post('detail')
  async findOne(@Body('id') id: string): Promise<App> {
    return this.appService.findOne(id);
  }

  @Post('create')
  async create(@Body() app: AppDto) {
    return this.appService.create(new AppDto(app));
  }

  @Post('update')
  async update(@Body('id') id, @Body() app: AppDto): Promise<App> {
    return this.appService.update(id, app);
  }

  @Post('delete')
  async delete(@Body('id') id: string): Promise<boolean> {
    return this.appService.delete(id);
  }
  @Post(':entityType/bind')
  async bindEntity(
    @Param('entityType') entityType: 'friends' | 'rooms' | 'plugins',
    @Body('id') appId: string,
    @Body('entityIds') entityIds: string[],
  ) {
    switch (entityType) {
      case 'friends':
        return this.appService.bindFriendToApp(appId, entityIds);
      case 'rooms':
        return this.appService.bindRoomsToApp(appId, entityIds);
      case 'plugins':
        return this.appService.bindPluginToApp(appId, entityIds);
      default:
        throw new NotFoundException(`Invalid entity type ${entityType}`);
    }
  }
}
