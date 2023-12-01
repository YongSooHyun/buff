import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from './image';
import { WorkoutProgramSet } from './workoutProgramSet';
import { WorkoutVideo } from './workoutVideo';

@Entity()
export class WorkoutWorkout {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkoutProgramSet)
  workoutSet: WorkoutProgramSet;

  @ManyToOne(() => WorkoutVideo)
  workoutVideo: WorkoutVideo;

  @ManyToOne(() => Image)
  coverImage: Image;
}
