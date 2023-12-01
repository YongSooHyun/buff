import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutCategory } from './workoutCategory';
import { WorkoutPart } from './workoutPart';
import { WorkoutProgram } from './workoutProgram';

@Entity()
export class WorkoutVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 125 })
  filePath: string;

  @Column({ default: false })
  isWarmup: boolean;

  @Column()
  duration: number;

  @Column()
  size: number;

  @Column({ nullable: true })
  lastUsedDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne(() => WorkoutCategory, (workoutCategory) => workoutCategory.workoutVideos, { eager: true })
  category: WorkoutCategory;

  @ManyToOne(() => WorkoutPart, (workoutPart) => workoutPart.workoutVideos, {
    eager: true,
  })
  part: WorkoutPart;

  @Column({ default: true })
  usable: boolean;
}
