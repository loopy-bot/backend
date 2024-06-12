import { BaseEntity } from 'src/common/base-class/base-entity';
import { Column, Entity } from 'typeorm';


@Entity()
export class Account extends BaseEntity {
  @Column()
  lastSessionId: string;
}
