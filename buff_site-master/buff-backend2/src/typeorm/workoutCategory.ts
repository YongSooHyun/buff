import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutProgram } from './workoutProgram';
import { WorkoutVideo } from './workoutVideo';

@Entity()
export class WorkoutCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @OneToMany(() => WorkoutVideo, (workoutVideo) => workoutVideo.category)
  workoutVideos: WorkoutVideo[];

  @OneToMany(() => WorkoutProgram, (workoutProgram) => workoutProgram.preferCategory)
  perferCategoryWorkoutPrograms: WorkoutProgram[];
}
