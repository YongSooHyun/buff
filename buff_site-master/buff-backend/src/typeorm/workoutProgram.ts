import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './image';
import { VideoPlayLog } from './videoPlayLog';
import { WorkoutCategory } from './workoutCategory';
import { WorkoutPart } from './workoutPart';
import { WorkoutProgramSchedule } from './workoutProgramSchedule';
import { WorkoutProgramSet } from './workoutProgramSet';
import { WorkoutTool } from './workoutTool';
import { WorkoutVideo } from './workoutVideo';

@Entity()
export class WorkoutProgram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  openDate: Date;

  @Column()
  closeDate: Date;

  @ManyToOne(() => Image)
  coverImage: Image;

  @ManyToOne(() => Image)
  workoutBreakTimeImage: Image;

  @ManyToOne(() => Image, { nullable: true })
  setBreakTimeImage: Image;

  @ManyToOne(() => Image)
  warmupBreakTimeImage: Image;

  // 뺄거
  @Column({ nullable: true })
  workoutBreakTimeSeconds: number;

  // 뺄거
  @Column({ nullable: true })
  setBreakTimeSeconds: number;

  // 뺠거
  @Column({ nullable: true })
  workoutTimeSeconds: number;

  @Column()
  setCount: number;

  // 널러블
  @Column({ nullable: true })
  warmupTimeSeconds: number;

  // 널러블
  @Column({ nullable: true })
  warmupBreakTimeSeconds: number;

  @Column({ nullable: true, default: true })
  usable: boolean;

  @ManyToMany(() => WorkoutVideo)
  @JoinTable()
  warmUpVideos: WorkoutVideo[];

  @ManyToMany(() => WorkoutTool, (workoutTools) => workoutTools.workoutPrograms, { eager: true })
  @JoinTable()
  workoutTools: WorkoutTool[];

  @OneToMany(() => WorkoutProgramSet, (set) => set.program)
  workoutSets: WorkoutProgramSet[];

  @ManyToMany(() => WorkoutVideo)
  @JoinTable()
  workoutVideos: WorkoutVideo[];

  @ManyToOne(() => WorkoutVideo, { nullable: true })
  descriptionVideo: WorkoutVideo;

  @ManyToOne(() => WorkoutCategory, (workoutCategory) => workoutCategory, {
    eager: true,
  })
  preferCategory: WorkoutCategory;

  @ManyToOne(() => WorkoutPart, (workoutPart) => workoutPart.preferPartWorkoutPrograms, { eager: true })
  preferPart: WorkoutPart;

  @OneToMany(() => VideoPlayLog, (videoPlayLog) => videoPlayLog.workoutProgram)
  log: VideoPlayLog[];

  @OneToMany(() => WorkoutProgramSchedule, (workoutProgramSchedule) => workoutProgramSchedule.workoutProgram)
  customerSchedule: WorkoutProgramSchedule[];
}
