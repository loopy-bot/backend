import { BaseEntity } from 'src/common/base-class/base-entity';
import { Column, Entity, IsNull, JoinTable, ManyToMany } from 'typeorm';
import { Friend } from 'src/modules/wx/entities/friend.entity';
import { Room } from 'src/modules/wx/entities/room.entity';
import { Plugin } from 'src/modules/plugins/entities/plugin.entity';

@Entity()
export class Task extends BaseEntity {
  @Column()
  name: string;

  @Column()
  time: string;

  @Column()
  description: string;

  @Column()
  text: string;

  @Column({ nullable: true })
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
