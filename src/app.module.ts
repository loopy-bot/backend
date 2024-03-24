import { mysqlConfig } from './../config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskModule } from './modules/task/task.module';
import { AppModule as App } from './modules/app/app.module';
import { WxModule } from './modules/wx/wx.module';
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

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'), // 配置静态资源文件夹路径
      // 这里的 '..','static' 路径是相对于 main.js 文件的位置
      // 例如，如果你的静态文件在项目的根目录下的 'static' 文件夹内
      // 可能还有更多可配置项
    }),

    App,
    PluginsModule,
    TaskModule,
    WxModule,
  ],
})
export class AppModule {}
