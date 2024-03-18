import { BaseEntity } from 'src/common/base-class/base-entity';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Column } from 'src/decorators/create-column';
import { Friend } from 'src/modules/wx-resource/entities/friend.entity';
import { Room } from 'src/modules/wx-resource/entities/room.entity';
import { Plugin } from 'src/modules/plugins/entities/plugin.entity';

@Entity()
export class App extends BaseEntity {
  @Column({ isRequired: true })
  name: string;

  @Column({ isRequired: false, nullable: true })
  description?: string;

  @Column({ isRequired: false, nullable: true })
  personality?: string;

  @OneToMany(() => Friend, (user) => user.app)
  friends: Friend[];

  @OneToMany(() => Room, (user) => user.app)
  rooms: Room[];

  @ManyToMany(() => Plugin)
  @JoinTable()
  plugins: Plugin[];
}
