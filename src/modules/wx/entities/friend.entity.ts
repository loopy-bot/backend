import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/base-class/base-entity';
import { App } from 'src/modules//app/entities/app.entity';
import { Task } from 'src/modules//task/entities/task.entity';

@Entity()
export class Friend extends BaseEntity {
  @Column()
  name: string;

  @Column()
  alias: string;

  @ManyToMany(() => Task, (task) => task.friends)
  tasks: Task[];

  @ManyToOne(() => App, (app) => app.friends)
  @JoinColumn()
  app: App;
}
