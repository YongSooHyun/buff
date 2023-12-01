import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { WorkoutProgram } from './workoutProgram';

export enum VideoPlayLogStatus {
  START_PLAY = 'START_PLAY',
  STOP_PLAY = 'STOP_PLAY',
  PAUSE_PLAY = 'PAUSE_PLAY',
  BREAK_TIME = 'BREAK_TIME',
  FINISH = 'FINISH',
  CREATE_PROGRAM_SESSION = 'CREATE_PROGRAM_SESSION',
  CREATE_CUSTOMER_PROGRAM_SESSION = 'CREATE_CUSTOMER_PROGRAM_SESSION',
  CREATE_SUB_PROGRAM_SESSION = 'CREATE_SUB_PROGRAM_SESSION',
}

@Entity()
export class VideoPlayLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.log, { cascade: true })
  user: User;

  @ManyToOne(() => WorkoutProgram, (workoutProgram) => workoutProgram.log, { cascade: true })
  workoutProgram: WorkoutProgram;

  @Column({ type: 'enum', enum: VideoPlayLogStatus })
  logType: VideoPlayLogStatus;

  @CreateDateColumn()
  createDate: Date;
}
