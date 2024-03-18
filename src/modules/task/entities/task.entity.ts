import { BaseEntity } from 'src/common/base-class/base-entity';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Column } from 'src/decorators/create-column';
import { Friend } from 'src/modules/wx-resource/entities/friend.entity';
import { Room } from 'src/modules/wx-resource/entities/room.entity';

@Entity()
export class Task extends BaseEntity {
  @Column({ isRequired: true })
  name: string;

  @Column({ isRequired: true })
  time?: number;

  @Column({ isRequired: false, nullable: true })
  description?: string;

  @Column({ isRequired: true })
  text?: string;

  @Column({ isRequired: false, nullable: true })
  count?: number;

  @ManyToMany(() => Friend, (friend) => friend.tasks)
  @JoinTable()
  friends: Friend[];

  @ManyToMany(() => Room, (room) => room.tasks)
  @JoinTable()
  rooms: Room[];
}
