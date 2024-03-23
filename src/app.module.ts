import { mysqlConfig } from './../config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskModule } from './modules/task/task.module';
import { AppModule as App } from './modules/app/app.module';
import { WxResourceModule } from './modules/wx-resource/wx-resource.module';
import { PluginsModule } from './modules/plugins/plugins.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...mysqlConfig,
      type: 'mysql',
      synchronize: true,
      poolSize: 10,
      connectorPackage: 'mysql2',
      entities: [__dirname + '/modules/**/entities/*.entity{.js,.ts}'],
    }),

    App,
    PluginsModule,
    TaskModule,
    WxResourceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
