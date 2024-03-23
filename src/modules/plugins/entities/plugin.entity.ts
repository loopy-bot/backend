import { App } from 'src/modules/app/entities/app.entity';
import { BaseEntity } from 'src/common/base-class/base-entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Task } from 'src/modules/task/entities/task.entity';

@Entity()
export class Plugin extends BaseEntity {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  url: string;

  @Column()
  method: 'POST' | 'GET';

  @Column()
  responseType: 'json' | 'arraybuffer';

  @ManyToMany(() => App, (app) => app.plugins)
  apps: App[];

  @ManyToMany(() => Task, (task) => task.plugins)
  tasks: Task[];
}
