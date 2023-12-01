import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutProgram } from './workoutProgram';
import { WorkoutWorkout } from './workoutWorkout';

@Entity()
export class WorkoutProgramSet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkoutProgram, (program) => program.workoutSets)
  program: WorkoutProgram;

  @OneToMany(() => WorkoutWorkout, (workout) => workout.workoutSet)
  workouts: WorkoutWorkout[];

  @Column()
  workoutTimeSeconds: number;

  @Column({ nullable: true })
  workoutTermSeconds: number;

  @Column({ nullable: true })
  breakTimeSeconds: number;

  // 세트 재생 횟수
  @Column({ default: 1 })
  setPlayCount: number;
}
