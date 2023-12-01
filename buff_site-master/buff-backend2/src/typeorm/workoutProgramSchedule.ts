import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkoutProgram } from './workoutProgram';

@Entity()
export class WorkoutProgramSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column()
  date: number;

  @Column()
  allDates: number;

  @ManyToOne(() => WorkoutProgram)
  workoutProgram: WorkoutProgram;

  @BeforeInsert()
  private calculateAllDates() {
    this.allDates = WorkoutProgramSchedule.DateToAllDateNumber(this.year, this.month, this.date);
  }

  public static DateToAllDateNumber(year: number, month: number, date?: number) {
    return new Date(year, month, date || 1).getTime() / (60000 * 60 * 24);
  }
}
