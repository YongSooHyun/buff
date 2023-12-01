import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { VideoPlayLog } from './videoPlayLog';
import { UserSubscription } from './userSubscription';
import { Gym } from './gym';
import { Image } from './image';

export enum UserRole {
  ADMIN = 'ADMIN',
  GYM = 'GYM',
  CUSTOMER = 'CUSTOMER',
  SUBGYM = 'SUBGYM',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserRole })
  userRole: UserRole;

  @CreateDateColumn()
  createdDate: Date;

  @Column({ default: false })
  granted: boolean;

  @Column({ default: false })
  suspended: boolean;

  @OneToMany(() => VideoPlayLog, (videoPlayLog) => videoPlayLog.user)
  log: VideoPlayLog[];

  @OneToMany(() => UserSubscription, (userSubscription) => userSubscription.user)
  subscriptions: UserSubscription[];

  @OneToOne(() => Gym, (gym) => gym.user, { nullable: true })
  @JoinColumn()
  gym?: Gym;

  @OneToOne(() => Image)
  @JoinColumn()
  subGymImage: Image;

  @BeforeInsert()
  async hashPassword() {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
