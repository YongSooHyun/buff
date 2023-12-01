import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Gym {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column({ type: 'double' })
  latitude: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phoneNumber1: string;

  @Column({ nullable: true })
  phoneNumber2: string;

  @Column({ nullable: true })
  bookingLink: string;

  @Column({ nullable: true })
  kakaoLink: string;

  @OneToOne(() => User, (user) => user.gym, { nullable: true })
  user?: User;
}
