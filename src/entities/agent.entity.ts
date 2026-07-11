import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('agent')
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  phone2: string;

  @Column({ default: '' })
  whatsapp: string;

  @Column({ default: '' })
  email: string;

  @Column({ type: 'text', default: '' })
  image: string;

  @Column({ default: '' })
  title: string;

  @Column({ type: 'text', default: '' })
  bio: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  listings: number[];
}
