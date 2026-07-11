import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 'General' })
  category: string;

  @Column({ default: '' })
  date: string;

  @Column({ type: 'text', default: '' })
  image: string;

  @Column({ type: 'text', default: '' })
  excerpt: string;

  @Column({ type: 'text', default: '' })
  content: string;
}
