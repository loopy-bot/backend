import { Controller, Post, Body } from '@nestjs/common';
import { App } from './entities/app.entity';
import { AppService } from './app.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

@Controller('application')
export class AppController {
  constructor(private readonly appServer: AppService) {}

  @Post('list')
  async findAll(): Promise<App[]> {
    return this.appServer.findAll();
  }

  @Post('item')
  async findOne(@Body('id') id: string): Promise<App> {
    return this.appServer.findOne(id);
  }

  @Post('create')
  async create(@Body() createAppDto: CreateAppDto): Promise<App> {
    return this.appServer.create(createAppDto);
  }

  @Post('update')
  async update(@Body() updateAppDto: UpdateAppDto): Promise<App> {
    return this.appServer.update(updateAppDto);
  }

  @Post('delete')
  async delete(@Body('id') id: string): Promise<boolean> {
    return this.appServer.delete(id);
  }
}
