import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Gym } from './typeorm/gym';
import { MediaArticle } from './typeorm/mediaArticle';
import type {
  CreateNoticeBody,
  CreateProgramSessionBody,
  CreateSubProgramSessionBody,
  CreateTypeBody,
  CreateWorkoutProgramBody,
  DeleteNoticeBody,
  DeleteTypeBody,
  GetNoticeQuery,
  ImagesQuery,
  PaginationQuery,
  ProgramsListQuery,
  RandomQuery,
  SignupBody,
  UpdatePasswordBody,
  UpdateProfileBody,
  UpdateUserBody,
  UpdateWorkoutProgramBody,
  UpdateWorkoutProgramScheduleBody,
  UploadImageBody,
  UploadVideoBody,
  VideosListQuery,
} from './types';
import { VideoService } from './video.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly videoService: VideoService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Request() req) {
    return this.appService.login(req.user);
  }

  @Get('auth/profile')
  async getProfile(@Query() query: { id: number }) {
    return this.appService.getProfile(query.id);
  }

  @Get('/auth/profile/subscriptions')
  getUserSubscriptions(@Query() query: { id: number }) {
    return this.appService.getUserSubscription(query.id);
  }

  @Post('auth/signup')
  async signup(@Body() body: SignupBody) {
    // username 중복없으면 undefined로 넘어옴
    const exist = await this.appService.findUser(body.username);

    if (!exist) {
      await this.appService.createUser(body);
      return;
    }

    if (exist.username === body.username) {
      throw new BadRequestException('아이디가 중복되었습니다.');
    }

    if (exist.email === body.email) {
      throw new BadRequestException('이메일이 중복되었습니다.');
    }

    return;
  }

  @Get('/admin/users')
  async getUsers() {
    return await this.appService.getUsers();
  }

  @Patch('/admin/users/:id')
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserBody) {
    await this.appService.updateUser(id, body);
  }

  @Patch('/admin/profile/:id')
  async updateProfile(@Param('id') id: number, @Body() body: UpdateProfileBody) {
    return this.appService.updateProfile(id, body);
  }

  @Patch('/admin/user/:id')
  async updatePassword(@Param('id') id: number, @Body() body: UpdatePasswordBody) {
    console.log('드가자', id, body);
    return await this.appService.upatePassword(id, body);
  }

  @Get('/articles')
  getMediaArticles(@Query() query: PaginationQuery) {
    return this.appService.getMediaArticles(query);
  }

  @Get('/gyms')
  getGyms(@Query() query: PaginationQuery) {
    return this.appService.getGyms(query);
  }

  @Get('/programs')
  async getPrograms(@Query() query: ProgramsListQuery) {
    return await this.appService.getWorkoutPrograms(query);
  }

  @Patch('/program/:id')
  setProgramUnusable(@Param('id') id: number) {
    return this.appService.setProgramUnUsable(id);
  }

  @Get('/programs/:id')
  async getProgram(@Param('id') id: number) {
    return await this.appService.getWorkoutProgram(id);
  }

  @Get('/session/:id')
  getProgramBySessionID(@Param('id') id: string) {
    return this.videoService.getWorkoutProgramBySessionID(id);
  }

  @Post('/session/sub')
  createSubProgramSession(@Body() body: CreateSubProgramSessionBody) {
    return this.videoService.createSubSession(body);
  }

  @Post('/session')
  createProgramSession(@Body() body: CreateProgramSessionBody) {
    return this.videoService.createSession(body);
  }

  @Post('/images/subgym/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSubGymImage(
    @Body() body: UploadImageBody,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    const image = await this.appService.uploadImageFile(body, file);
    await this.appService.updateSubgymImage(id, image);
    return image;
  }

  @Delete('images/subgym/:id')
  async unsetSubGymImage(@Param('id') id: number) {
    return this.appService.updateSubgymImage(id, null);
  }

  @Get('/admin/types')
  async getTypes() {
    return await this.appService.getTypes();
  }

  @Get('/admin/deletable_types')
  async getDeletableTypes() {
    return await this.appService.getDeletableTypes();
  }

  @Post('/admin/types')
  async createType(@Body() body: CreateTypeBody) {
    await this.appService.createType(body);
  }

  @Delete('/admin/types')
  async deleteType(@Body() body: DeleteTypeBody) {
    await this.appService.deleteType(body);
  }

  @Get('/admin/images')
  async getImages(@Query() query: ImagesQuery) {
    return await this.appService.getImages(query.type);
  }

  @Patch('/admin/image')
  async hideImage(@Body() body: { id: number }) {
    console.log(body, 'zzzzz');
    return await this.appService.hideImage(body.id);
  }

  @Patch('/admin/video')
  async hideVideo(@Body() body: { id: number }) {
    console.log(body, 'zzzzz');
    return await this.appService.hideVideo(body.id);
  }

  @Post('/admin/articles')
  createArticle(@Body() body: MediaArticle) {
    return this.appService.createArticle(body);
  }

  @Delete('/admin/articles/:id')
  deleteArticle(@Param() id: number) {
    return this.appService.deleteArticle(id);
  }

  @Post('/admin/gyms')
  createGym(@Body() body: Gym) {
    return this.appService.createGym(body);
  }

  @Patch('/admin/gyms')
  updateGym(@Body() body: Gym) {
    return this.appService.updateGym(body);
  }

  @Delete('/admin/gyms/:id')
  deleteGym(@Param() id: number) {
    return this.appService.deleteGym(id);
  }

  @Post('/admin/images/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@Body() body: UploadImageBody, @UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadImageFile(body, file);
  }

  @Get('/admin/videos')
  getVideos(@Query() query: VideosListQuery) {
    return this.appService.getWorkoutVideos(query);
  }

  @Get('/admin/videos_pagenation')
  getVideosWithPagenation(@Query() query: VideosListQuery) {
    return this.appService.getWorkoutVideosWithPagenation(query);
  }

  @Post('/admin/videos/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@Body() body: UploadVideoBody, @UploadedFile() file: Express.Multer.File) {
    await this.appService.uploadVideoFile(body, file);
  }

  @Get('/admin/videos/form')
  async getVideoUploadForm() {
    return {
      ...(await this.appService.getVideoFormInitialData()),
    };
  }

  @Get('/admin/programs')
  async getProgramsAdmin(@Query() query: ProgramsListQuery) {
    return await this.appService.getWorkoutPrograms(query, true);
  }

  @Post('/admin/programs')
  async createProgram(@Body() body: CreateWorkoutProgramBody) {
    await this.appService.saveWorkoutProgram(body);
  }

  @Patch('/admin/programs')
  async editProgram(@Body() body: UpdateWorkoutProgramBody) {
    const { id, ...data } = body;
    await this.appService.saveWorkoutProgram(data, id);
  }

  @Get('/admin/programs/:id')
  async getProgramForEdit(@Param('id') id: number) {
    return await this.appService.getWorkoutProgram(id);
  }

  @Post('/admin/schedule/programs/customer')
  async editCustomerProgramScedule(@Body() body: UpdateWorkoutProgramScheduleBody) {
    return this.appService.updateProgramSchedule(body);
  }

  @Post('admin/notice')
  async createNotice(@Body() body: CreateNoticeBody) {
    return await this.appService.createNotice(body);
  }

  @Delete('admin/notice')
  async deleteNotice(@Body() body: DeleteNoticeBody) {
    console.log(body, 'body zz');
    return await this.appService.deleteNotice(body);
  }

  @Patch('admin/notice')
  async editNotice(@Body() body: CreateNoticeBody) {
    return this.appService.patchNotice(body);
  }

  @Get('notices')
  async getNotices() {
    return await this.appService.getNotices();
  }

  @Get('notice')
  async getNotice(@Query() query: GetNoticeQuery) {
    return await this.appService.getNotice(query);
  }

  @Get('admin/randomize')
  async getRandomizedVideos(@Query() query: RandomQuery) {
    return await this.appService.getRandomizedVideos(query);
  }
}
