import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('property')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'int' })
  price: number;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column({ default: '' })
  label: string;

  @Column({ type: 'int', default: 0 })
  beds: number;

  @Column({ type: 'int', default: 0 })
  baths: number;

  @Column({ type: 'int', default: 0 })
  sqft: number;

  @Column({ type: 'text', default: '' })
  image: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ default: '' })
  location: string;

  @Column({ default: '' })
  state: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ type: 'varchar', default: '' })
  createdAt: string;
}
