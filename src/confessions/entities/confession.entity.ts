import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Confession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  likes: number;
}
