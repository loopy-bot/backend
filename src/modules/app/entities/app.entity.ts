import { BaseEntity } from 'src/common/base-class/base-entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Friend } from 'src/modules/wx-resource/entities/friend.entity';
import { Room } from 'src/modules/wx-resource/entities/room.entity';
import { Plugin } from 'src/modules/plugins/entities/plugin.entity';

@Entity()
export class App extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  personality: string;

  @OneToMany(() => Friend, (user) => user.app)
  friends: Friend[];

  @OneToMany(() => Room, (user) => user.app)
  rooms: Room[];

  @ManyToMany(() => Plugin, (plugin) => plugin.apps)
  @JoinTable()
  plugins: Plugin[];
}
