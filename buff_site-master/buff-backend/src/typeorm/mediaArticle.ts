import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MediaArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  link: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  mediaName: string;

  @Column({ nullable: true })
  body: string;
}
