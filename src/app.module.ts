import { mysqlConfig } from './../config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskModule } from './modules/task/task.module';
import { AppModule as App } from './modules/app/app.module';
import { WxModule } from './modules/wx/wx.module';
import { PluginsModule } from './modules/plugins/plugins.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AccountModule } from './modules/account/account.module';
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: 'static',
    }),
    App,
    PluginsModule,
    TaskModule,
    WxModule,
    UploadModule,
    AccountModule,
  ],
})
export class AppModule {}
