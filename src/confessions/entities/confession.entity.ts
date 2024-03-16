import { User } from 'src/auth/entities/user.entity';
import { Column, Entity,  ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.confessions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
