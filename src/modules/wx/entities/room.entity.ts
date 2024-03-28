import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/base-class/base-entity';
import { App } from 'src/modules/app/entities/app.entity';
import { Task } from 'src/modules/task/entities/task.entity';

@Entity()
export class Room extends BaseEntity {
  @Column()
  name: string;

  @Column()
  memberCount: number;

  @ManyToMany(() => Task, (task) => task.rooms)
  tasks: Task[];

  @ManyToOne(() => App, (app) => app.rooms)
  @JoinColumn()
  app: App;
}
