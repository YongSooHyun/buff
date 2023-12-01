import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository } from 'typeorm';
import * as fs from 'fs/promises';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { nanoid } from 'nanoid';
import * as mime from 'mime-types';
import * as sharp from 'sharp';

import {
  CreateNoticeBody,
  CreateTypeBody,
  CreateWorkoutProgramBody,
  DeleteNoticeBody,
  DeleteTypeBody,
  GetNoticeQuery,
  PaginationQuery,
  ProgramsListQuery,
  RandomQuery,
  SignupBody,
  UpdatePasswordBody,
  UpdateProfileBody,
  UpdateUserBody,
  UpdateWorkoutProgramScheduleBody,
  UploadImageBody,
  UploadVideoBody,
  VideosListQuery,
} from './types';
import { Gym } from './typeorm/gym';
import { MediaArticle } from './typeorm/mediaArticle';
import { User, UserRole } from './typeorm/user';
import { WorkoutVideo } from './typeorm/workoutVideo';
import { WorkoutCategory } from './typeorm/workoutCategory';
import { WorkoutPart } from './typeorm/workoutPart';
import { WorkoutProgram } from './typeorm/workoutProgram';
import { Image, ImageType } from './typeorm/image';
import { UserSubscription } from './typeorm/userSubscription';
import { WorkoutProgramScheduleType } from './typeorm/workoutProgramScheduleType';
import { WorkoutProgramSchedule } from './typeorm/workoutProgramSchedule';
import { WorkoutTool } from './typeorm/workoutTool';
import { Notice } from './typeorm/notice';
import { WorkoutProgramSet } from './typeorm/workoutProgramSet';
import { WorkoutWorkout } from './typeorm/workoutWorkout';
import * as ffmpeg from 'fluent-ffmpeg';
import * as bcrypt from 'bcrypt';
import { Console } from 'console';
@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Gym)
    private readonly gymsRepo: Repository<Gym>,
    @InjectRepository(MediaArticle)
    private readonly mediaArticlesRepo: Repository<MediaArticle>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepo: Repository<UserSubscription>,
    @InjectRepository(WorkoutProgram)
    private readonly workoutProgramRepo: Repository<WorkoutProgram>,
    @InjectRepository(WorkoutVideo)
    private readonly workoutVideoRepo: Repository<WorkoutVideo>,
    @InjectRepository(WorkoutCategory)
    private readonly workoutCategoryRepo: Repository<WorkoutCategory>,
    @InjectRepository(WorkoutPart)
    private readonly workoutPartRepo: Repository<WorkoutPart>,
    @InjectRepository(WorkoutProgramSchedule)
    private readonly programScheduleRepo: Repository<WorkoutProgramSchedule>,
    @InjectRepository(WorkoutProgramScheduleType)
    private readonly programScheduleTypeRepo: Repository<WorkoutProgramScheduleType>,
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
    @InjectRepository(WorkoutTool)
    private readonly workoutToolRepo: Repository<WorkoutTool>,
    @InjectRepository(WorkoutProgramSet)
    private readonly workoutSetRepo: Repository<WorkoutProgramSet>,
    @InjectRepository(WorkoutWorkout)
    private readonly workoutWorkoutRepo: Repository<WorkoutWorkout>,
    @InjectRepository(Notice)
    private readonly noticeRepo: Repository<Notice>,
    private readonly connection: Connection,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepo.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result as User;
    }

    return null;
  }

  async login(user: User) {
    const userSubscription = await this.usersRepo.findOne(
      { id: user.id },
      { relations: ['subscriptions', 'subGymImage'] },
    );

    const payload = {
      username: user.username,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      sub: user.id,
      role: user.userRole,
      granted: userSubscription.granted,
      subscriptions: userSubscription.subscriptions[0],
      subGymImage: userSubscription.subGymImage,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async getProfile(id) {
    const user = await this.usersRepo.findOne({ id }, { relations: ['subscriptions', 'subGymImage'] });
    const payload = {
      username: user.username,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      sub: user.id,
      role: user.userRole,
      granted: user.granted,
      subscriptions: user.subscriptions[0],
      subGymImage: user.subGymImage,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserSubscription(id: number) {
    const user = await this.usersRepo.findOne({ id }, { relations: ['subscriptions'] });
    return { subscriptions: user.subscriptions };
  }

  async findUser(username: string) {
    return this.usersRepo.findOne({ username });
  }

  async createUser(body: SignupBody) {
    const user = new User();
    user.userRole = body.userRole;
    user.username = body.username;
    user.password = body.password;
    user.name = body.name;
    user.phoneNumber = body.phoneNumber;
    user.email = body.email;
    return await this.usersRepo.save(user);
  }

  async updateUser(id: number, body: UpdateUserBody) {
    const user = await this.usersRepo.findOne({ id }, { relations: ['subscriptions'] });

    if (typeof body.granted !== 'undefined') {
      user.granted = body.granted;
    }
    if (typeof body.suspended !== 'undefined') {
      user.suspended = body.suspended;
    }
    if (typeof body.subscription !== 'undefined') {
      const sub = body.subscription.id
        ? user.subscriptions.find((sub) => sub.id === body.subscription.id)
        : new UserSubscription();

      sub.startDate = new Date(body.subscription.startDate);
      sub.endDate = new Date(body.subscription.endDate);

      if (!body.subscription.id) {
        user.subscriptions.push(sub);
      }
    }
    if (typeof body.role !== 'undefined') {
      user.userRole = body.role;
    }
    if (typeof body.gymID !== 'undefined') {
      user.gym = { id: body.gymID } as Gym;
    }
    await this.usersRepo.save(user);
    if (typeof body.subscription !== 'undefined') {
      if (!body.subscription.startDate || !body.subscription.endDate) {
        return;
      }
      const entity = {
        id: body.subscription.id,
        startDate: user.subscriptions[0].startDate,
        endDate: user.subscriptions[0].endDate,
        user: user,
      };

      await this.userSubscriptionRepo.save(entity);
    }
  }
  async updateProfile(id: number, body: UpdateProfileBody) {
    await this.usersRepo.update(id, { name: body.name, phoneNumber: body.phoneNumber, email: body.email });
    const user = await this.usersRepo.findOne({ id });
    const userSubscription = await this.usersRepo.findOne({ id }, { relations: ['subscriptions', 'subGymImage'] });

    const payload = {
      username: user.username,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      sub: user.id,
      role: user.userRole,
      granted: userSubscription.granted,
      subscriptions: userSubscription.subscriptions[0],
      subGymImage: userSubscription.subGymImage,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async upatePassword(id: number, body: UpdatePasswordBody) {
    const user = await this.usersRepo.findOne({ id });
    if (user && (await user.validatePassword(body.old))) {
      const password = await bcrypt.hash(body.new, 10);
      return await this.usersRepo.update(id, { password });
    }
    return false;
  }
  async getUsers() {
    return await this.usersRepo.find({ relations: ['subscriptions'] });
  }
  async getGyms(query: PaginationQuery) {
    return await this.gymsRepo.find({
      order: { name: 'ASC' },
      take: query.limit || 100,
      skip: query.offset || 0,
    });
  }

  async getMediaArticles(query: PaginationQuery) {
    return await this.mediaArticlesRepo.find({
      order: { id: 'DESC' },
      take: query.limit || 100,
      skip: query.offset || 0,
    });
  }

  async uploadVideoFile(info: UploadVideoBody, file: Express.Multer.File) {
    const absolute = process.env.NODE_ENV === 'production' ? '/' : '';
    const id = nanoid(6);
    const origin = `${absolute}uploads/videos/origin/${id}.${mime.extension(file.mimetype)}`;

    const path = `${absolute}uploads/videos/workout/${id}.${mime.extension(file.mimetype)}`;

    await fs.writeFile(origin, file.buffer);

    const encode = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        ffmpeg(origin)
          .videoCodec('libx264')
          .format('mp4')
          .on('error', (err) => {
            reject(err);
            console.log(err, ' ---------ERROR');
          })
          .on('end', () => {
            resolve();
            console.log('Processing finished');
          })
          .save(path);
      });
    };

    await encode();

    const workoutVideo = new WorkoutVideo();
    workoutVideo.filePath = path;
    workoutVideo.name = info.name;
    workoutVideo.isWarmup = info.isWarmup;
    workoutVideo.size = file.size;
    workoutVideo.duration = await getVideoDurationInSeconds(origin);
    workoutVideo.category = { id: info.categoryID } as WorkoutCategory;
    workoutVideo.part = { id: info.partID } as WorkoutPart;
    await this.workoutVideoRepo.save(workoutVideo);
  }

  async uploadImageFile(info: UploadImageBody, file: Express.Multer.File) {
    const absolute = process.env.NODE_ENV === 'production' ? '/' : '';
    const path = `${absolute}uploads/images/${nanoid(6)}.${mime.extension(file.mimetype)}`;
    await fs.writeFile(path, file.buffer);
    const image = new Image();
    image.filePath = path;
    image.name = info.name;
    image.type = info.type;
    if (info.type !== ImageType.VIDEO) {
      const thumbnailPath = await this.uploadThumbnailImage(file);
      image.thumbnailPath = thumbnailPath;
    }
    await this.imageRepo.save(image);

    return image;
  }

  async hideVideo(id: number) {
    await this.workoutVideoRepo.update(id, { usable: false });
  }
  async hideImage(id: number) {
    await this.imageRepo.update(id, { usable: false });
  }
  async uploadThumbnailImage(file: Express.Multer.File) {
    const absolute = process.env.NODE_ENV === 'production' ? '/' : '';
    const path = `${absolute}uploads/images/thumbs/${nanoid(6)}.jpeg`;
    const thumbnailBuffer = await sharp(file.buffer).resize(160).jpeg().toBuffer();
    await fs.writeFile(path, thumbnailBuffer);
    return path;
  }

  async getVideoFormInitialData() {
    return {
      category: await this.workoutCategoryRepo.find({ order: { id: 'ASC' } }),
      part: await this.workoutPartRepo.find({ order: { id: 'ASC' } }),
    };
  }

  // 프로그램
  async saveWorkoutProgram(data: CreateWorkoutProgramBody, programID?: number) {
    const workoutProgram = new WorkoutProgram();
    if (programID) {
      const id = programID;
      this.workoutProgramRepo.update(id, { usable: false });
    }

    workoutProgram.name = data.name;
    workoutProgram.openDate = new Date(data.openDateMillis);
    workoutProgram.closeDate = new Date(data.closeDateMillis);
    workoutProgram.setCount = data.setCount;
    workoutProgram.setBreakTimeSeconds = data.setBreakTimeSeconds;
    workoutProgram.workoutTimeSeconds = data.workoutTimeSeconds;
    workoutProgram.workoutBreakTimeSeconds = data.workoutBreakTimeSeconds;
    workoutProgram.coverImage = { id: data.coverImageID } as Image;
    workoutProgram.setBreakTimeImage = {
      id: data.setBreakTimeImageID,
    } as Image;
    workoutProgram.workoutBreakTimeImage = {
      id: data.workoutBreakTimeImageID,
    } as Image;
    workoutProgram.warmupBreakTimeImage = {
      id: data.warmUpImageID,
    } as Image;
    workoutProgram.descriptionVideo = { id: data.descriptionVideoID } as WorkoutVideo;
    workoutProgram.workoutSets = this.workoutSetRepo.create(
      data.workoutSets.map((set) => ({
        breakTimeSeconds: set.breakTimeSeconds,
        workoutTermSeconds: set.workoutTermSeconds,
        workoutTimeSeconds: set.workoutTimeSeconds,
        setPlayCount: set.setPlayCount || 1,
        workouts: this.workoutWorkoutRepo.create(
          set.workouts.map((w) => ({
            workoutVideo: this.workoutVideoRepo.create({ id: w.videoID }),
            coverImage: this.imageRepo.create({ id: w.workoutFinishImageID || null }),
          })),
        ),
      })),
    );
    const videoIDs = [];

    workoutProgram.workoutSets.forEach((sets) => {
      sets.workouts.forEach((workout) => {
        videoIDs.push(workout.workoutVideo.id);
      });
    });

    for (const id of videoIDs) {
      await this.workoutVideoRepo.save({
        id,
        lastUsedDate: new Date(),
      });
    }
    workoutProgram.preferCategory = {
      id: data.preferCategoryID,
    } as WorkoutCategory;
    workoutProgram.preferPart = {
      id: data.preferPartID,
    } as WorkoutPart;
    workoutProgram.workoutTools = data.toolIDs.map((id) => ({
      id,
    })) as WorkoutTool[];
    workoutProgram.warmupTimeSeconds = data.warmupTimeSeconds;
    workoutProgram.warmupBreakTimeSeconds = data.warmupBreakTimeSeconds;
    workoutProgram.warmUpVideos = data.warmUpVideoIds.map((id) => ({ id })) as WorkoutVideo[];

    try {
      const program = await this.workoutProgramRepo.save(workoutProgram);
      for (const set of workoutProgram.workoutSets) {
        set.program = program;
        const saved = await this.workoutSetRepo.save(set);
        this.connection.manager.save(
          set.workouts.map((w) => {
            w.workoutSet = saved;
            return w;
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getWorkoutProgram(programID: number) {
    // programID = programID == 1 ? 28 : programID;
    const workoutProgram = await this.workoutProgramRepo.findOne(programID, {
      relations: [
        'workoutSets',
        'workoutSets.workouts',
        'workoutSets.workouts.workoutVideo',
        'workoutSets.workouts.coverImage',
        'warmUpVideos',
        'workoutTools',
        'coverImage',
        'setBreakTimeImage',
        'workoutBreakTimeImage',
        'warmupBreakTimeImage',
        'descriptionVideo',
      ],
    });
    return workoutProgram;
  }

  async getWorkoutPrograms(query: ProgramsListQuery, all = false) {
    const qb = this.connection
      .createQueryBuilder(WorkoutProgram, 'programs')
      .innerJoinAndSelect('programs.coverImage', 'coverImage')
      .innerJoinAndSelect('programs.preferPart', 'preferPart')
      .innerJoinAndSelect('programs.preferCategory', 'preferCategory')
      .innerJoinAndSelect('programs.workoutSets', 'workoutSets')
      .take(query.limit || 100)
      .skip(query.offset || 0);

    qb.where('programs.usable = true');
    if (query.targetUserRole === UserRole.GYM) {
      if (!all) {
        qb.andWhere('programs.openDate < :date', { date: new Date() }).andWhere('programs.closeDate > :date', {
          date: new Date(),
        });
      }
      qb.orderBy('programs.id', 'DESC');
    } else if (query.targetUserRole === UserRole.CUSTOMER) {
      const from = WorkoutProgramSchedule.DateToAllDateNumber(query.fromYear, query.fromMonth);
      const to = WorkoutProgramSchedule.DateToAllDateNumber(query.toYear, query.toMonth);

      qb.innerJoinAndSelect('programs.customerSchedule', 'customerSchedule')
        .andWhere('customerSchedule.allDates >= :from', { from })
        .andWhere('customerSchedule.allDates < :to', { to })
        .orderBy('customerSchedule.allDates', 'ASC');
    }

    const programs = await qb.getMany();

    for (const p of programs) {
      await p.workoutVideos;
    }
    return programs;
  }

  async setProgramUnUsable(id: number) {
    this.workoutProgramRepo.update(id, { usable: false });
  }
  async getWorkoutVideos(query: VideosListQuery) {
    const videos = this.workoutVideoRepo.createQueryBuilder('videos').select();

    if (query.preferCategoryID && query.preferPartID) {
      videos.orderBy(
        `(CASE 
            WHEN videos.categoryId IS ${query.preferCategoryID} THEN 1 
            WHEN videos.partId IS ${query.preferPartID} THEN 2
            ELSE NULL
            END)`,
      );
    }
    videos.where('usable = true');
    if (query.limit) {
      videos.take(query.limit || 2).skip(query.offset || 0);
    }

    return videos.execute();
  }

  async getWorkoutVideosWithPagenation(query: VideosListQuery) {
    const qb = this.workoutVideoRepo.createQueryBuilder('videos').select();
    let total = (await this.workoutVideoRepo.find({ usable: true })).length;

    if (query.preferCategoryID && query.preferPartID) {
      qb.orderBy(
        `(CASE 
            WHEN videos.categoryId IS ${query.preferCategoryID} THEN 1 
            WHEN videos.partId IS ${query.preferPartID} THEN 2
            ELSE NULL
            END)`,
      );
    }
    qb.where('usable = true');
    if (query.query) {
      qb.andWhere('videos.name like :name', { name: `%${query.query}%` });
      total = (await this.workoutVideoRepo.find({ usable: true, name: Like(`%${query.query}%`) })).length;
    }

    qb.take(query.limit || 100).skip(query.offset * query.limit || 0);

    const count = Math.ceil(total / query.limit);

    let beforePages = 0;
    let afterPages = 0;

    const offset = Number(query.offset);
    const pages = [];
    if (offset < 1) {
      beforePages = 0;
    } else if (offset == 1) {
      beforePages = 1;
    } else {
      beforePages = 2;
    }

    if (beforePages == 0) {
      afterPages = 4;
      if (offset == count - 1) {
        afterPages = 0;
      } else if (offset == count - 2) {
        afterPages = 1;
      } else if (offset == count - 3) {
        afterPages = 2;
      } else if (offset == count - 4) {
        afterPages = 3;
      }
    } else if (beforePages == 1) {
      afterPages = 3;
      if (offset == count - 1) {
        afterPages = 0;
      } else if (offset == count - 2) {
        afterPages = 1;
      } else if (offset == count - 3) {
        afterPages = 2;
      }
    } else {
      afterPages = 2;
      if (offset == count - 1) {
        afterPages = 0;
      } else if (offset == count - 2) {
        afterPages = 1;
      }
    }

    for (let i = beforePages; i > 0; i--) {
      pages.push(offset - i);
    }
    pages.push(Number(offset));

    for (let i = 1; i <= afterPages; i++) {
      pages.push(Number(offset) + i);
    }
    const videos = await qb.execute();
    return {
      videos,
      total,
      count,
      pages,
      current: query.offset,
    };
  }
  async getWorkoutVideosByIds(ids: number[]) {
    return this.workoutVideoRepo.findByIds(ids, {
      relations: ['category', 'part'],
    });
  }

  async getTypes() {
    const categories = await this.workoutCategoryRepo.find();
    const parts = await this.workoutPartRepo.find();
    const scheduleTypes = await this.programScheduleTypeRepo.find();
    const tools = await this.workoutToolRepo.find();

    // await this.workoutToolRepo.find({ relations: ['workoutPrograms'] })

    // const qb = this.connection
    //   .createQueryBuilder(WorkoutTool, 'workoutTools')
    //   .leftJoinAndSelect('workoutTools.id', 'workoutTools.workoutPrograms');

    return {
      categories,
      parts,
      scheduleTypes,
      tools,
    };
  }

  async getDeletableTypes() {
    const tools = (await this.workoutToolRepo.find({ relations: ['workoutPrograms'] })).filter(
      (tool) => !tool.workoutPrograms.length,
    );

    const categories = (
      await this.workoutCategoryRepo.find({
        relations: ['workoutVideos', 'perferCategoryWorkoutPrograms'],
      })
    ).filter((category) => !category.perferCategoryWorkoutPrograms.length && !category.workoutVideos.length);

    const parts = (
      await this.workoutPartRepo.find({
        relations: ['workoutVideos', 'preferPartWorkoutPrograms'],
      })
    ).filter((part) => !part.preferPartWorkoutPrograms.length && !part.workoutVideos.length);
    return {
      tools,
      categories,
      parts,
    };
  }

  async createType(body: CreateTypeBody) {
    switch (body.type) {
      case 'CATEGORY':
        return this.workoutCategoryRepo.save({ name: body.name });
      case 'PART':
        return this.workoutPartRepo.save({ name: body.name });
      case 'SCHEDULE_TYPE':
        return this.programScheduleTypeRepo.save({ name: body.name });
      case 'TOOL':
        return this.workoutToolRepo.save({ name: body.name });
      default:
        break;
    }
  }

  async deleteType(body: DeleteTypeBody) {
    switch (body.type) {
      case 'CATEGORY':
        return this.workoutCategoryRepo.delete({ id: body.id });
      case 'PART':
        return this.workoutPartRepo.delete({ id: body.id });
      case 'SCHEDULE_TYPE':
        return this.programScheduleTypeRepo.delete({ id: body.id });
      case 'TOOL':
        return this.workoutToolRepo.delete({ id: body.id });
      default:
        break;
    }
  }

  async getImages(type?: ImageType) {
    if (type) {
      return await this.imageRepo.find({ type, usable: true });
    }
    return await this.imageRepo.find({ usable: true });
  }

  async getDeletableImages() {
    const images = this.imageRepo.find({ relations: [''] });
  }
  async updateProgramSchedule(body: UpdateWorkoutProgramScheduleBody) {
    switch (body.type) {
      case 'CREATE':
        const schedule = this.programScheduleRepo.create();
        schedule.year = body.year;
        schedule.month = body.month;
        schedule.date = body.date;
        schedule.workoutProgram = { id: body.programID } as WorkoutProgram;
        await this.programScheduleRepo.save(schedule);
        break;
      case 'DELETE':
        await this.programScheduleRepo.delete({ id: body.scheduleID });
      default:
        break;
    }
  }

  async createArticle(body: MediaArticle) {
    return this.mediaArticlesRepo.save(body);
  }

  async deleteArticle(id: number) {
    return this.mediaArticlesRepo.delete(id);
  }

  async createGym(body: Gym) {
    return this.gymsRepo.save(body);
  }

  async updateGym(body: Gym) {
    if (!body.id) {
      throw new BadRequestException();
    }
    return this.gymsRepo.save(body);
  }

  async deleteGym(id: number) {
    return this.gymsRepo.delete(id);
  }
  async getNotices() {
    return this.noticeRepo.find({
      order: { createDate: 'DESC' },
    });
  }
  async createNotice(body: CreateNoticeBody) {
    return this.noticeRepo.save(body);
  }
  async deleteNotice(body: DeleteNoticeBody) {
    return this.noticeRepo.delete({ id: body.id });
  }
  async patchNotice(body: CreateNoticeBody) {
    return this.noticeRepo.update(body.id, body);
  }
  async getNotice(query: GetNoticeQuery) {
    return this.noticeRepo.findOne({ id: query.id });
  }

  async getRandomizedVideos(query: RandomQuery) {
    const videos = this.workoutVideoRepo.createQueryBuilder('videos');
    if (query.categoryID) {
      videos.where('categoryId = :cc', { cc: query.categoryID });
    }
    if (query.partID) {
      videos.andWhere('partId = :pp', { pp: query.partID });
    }

    const count = query.count * (query.setCount || 1) || 100;
    videos.orderBy('videos.lastUsedDate', 'ASC').take(count);

    return videos.execute();
  }

  updateSubgymImage(id: number, image?: Image) {
    return this.usersRepo.update(id, { subGymImage: image || null });
  }
}
