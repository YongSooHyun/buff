import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutProgram } from './workoutProgram';

@Entity()
export class WorkoutTool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @ManyToMany(() => WorkoutProgram, (workoutPrograms) => workoutPrograms.workoutTools)
  workoutPrograms: WorkoutProgram[];
}
