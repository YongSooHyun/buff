import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ImageType {
  WARMUP_BREAK = 'WARMUP_BREAK',
  SET_BREAK = 'SET_BREAK',
  WORKOUT_BREAK = 'WORKOUT_BREAK',
  WORKOUT_COVER = 'WORKOUT_COVER',
  THUMBNAIL = 'THUMBNAIL',
  VIDEO = 'VIDEO',
  SUBGYM_COVER = 'SUBGYM_COVER',
}

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, length: 125 })
  filePath: string;

  @Column({ type: 'enum', enum: ImageType })
  type: ImageType;

  @CreateDateColumn()
  createdDate: Date;

  @Column({ nullable: true, unique: true, length: 125 })
  thumbnailPath: string;

  @Column({ default: true })
  usable: boolean;
}
