import { ChildEntity, Column } from 'typeorm';
import { Space } from './space.entity';

@ChildEntity()
export class MeetingRoom extends Space {
  @Column()
  hasProjector: boolean;

  @Column()
  hasWhiteboard: boolean;
}
