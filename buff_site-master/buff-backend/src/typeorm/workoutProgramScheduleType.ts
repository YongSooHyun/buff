import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkoutProgramScheduleType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 125 })
  name: string;
}
