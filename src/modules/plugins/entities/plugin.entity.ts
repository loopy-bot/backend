import axios from 'axios';
import { App } from 'src/modules/app/entities/app.entity';
import { BaseEntity } from 'src/common/base-class/base-entity';
import { Column } from 'src/decorators/create-column';
import { Entity, JoinTable, ManyToMany } from 'typeorm';
import { Task } from 'src/modules/task/entities/task.entity';

@Entity()
export class Plugin extends BaseEntity {
  @Column({ isRequired: true })
  name: string;
  @Column({ isRequired: true })
  type: string;
  @Column({ isRequired: false, nullable: true })
  description?: string;
  @Column({ isRequired: true })
  url: string;
  @Column({ isRequired: true })
  method: 'POST' | 'GET';

  @Column({ isRequired: true })
  responseType: 'json' | 'arraybuffer';

  @ManyToMany(() => App)
  apps: App[];

  @ManyToMany(() => Task)
  tasks: Task[];
  async reply(text: string) {
    return axios({
      url: this.url,
      method: this.method,
      params: { text },
      headers: { responseType: this.responseType },
    });
  }
}
