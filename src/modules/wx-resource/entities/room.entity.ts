import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/base-class/base-entity';
import { Column } from 'src/decorators/create-column';
import { App } from 'src/modules/app/entities/app.entity';
import { Task } from 'src/modules/task/entities/task.entity';

@Entity()
export class Room extends BaseEntity {
  @Column({ nullable: true, isRequired: true })
  name: string;

  @Column({ isRequired: true })
  wxId: string;

  @Column({ isRequired: true })
  memberCount: number;

  @ManyToMany(() => Task, (task) => task.friends)
  tasks: Task[];
  // 设置多对一关系，每个用户关联到一个应用
  @ManyToOne(() => App, (app) => app.rooms)
  @JoinColumn() // 这会在 User 表中创建一个外键列
  app: App;
}
