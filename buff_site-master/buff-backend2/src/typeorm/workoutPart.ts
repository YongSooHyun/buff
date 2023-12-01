import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutProgram } from './workoutProgram';
import { WorkoutVideo } from './workoutVideo';

@Entity()
export class WorkoutPart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @OneToMany(() => WorkoutVideo, (workoutVideo) => workoutVideo.part)
  workoutVideos: WorkoutVideo[];

  @OneToMany(() => WorkoutProgram, (workoutProgram) => workoutProgram.preferPart)
  preferPartWorkoutPrograms: WorkoutProgram[];
}
