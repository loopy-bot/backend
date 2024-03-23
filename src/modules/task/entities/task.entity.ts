import { BaseEntity } from 'src/common/base-class/base-entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Friend } from 'src/modules/wx-resource/entities/friend.entity';
import { Room } from 'src/modules/wx-resource/entities/room.entity';
import { Plugin } from 'src/modules/plugins/entities/plugin.entity';

@Entity()
export class Task extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'bigint' })
  time: number;

  @Column()
  description: string;

  @Column()
  text: string;

  @Column()
  count: number;

  @ManyToMany(() => Friend, (friend) => friend.tasks)
  @JoinTable()
  friends: Friend[];

  @ManyToMany(() => Room, (room) => room.tasks)
  @JoinTable()
  rooms: Room[];

  @ManyToMany(() => Plugin, (plugin) => plugin.tasks)
  @JoinTable()
  plugins: Plugin[];
}
