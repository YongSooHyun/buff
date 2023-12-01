import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Gym } from '../gym';
import { Image, ImageType } from '../image';
import { MediaArticle } from '../mediaArticle';
import { User, UserRole } from '../user';
import { UserSubscription } from '../userSubscription';
import { WorkoutCategory } from '../workoutCategory';
import { WorkoutPart } from '../workoutPart';
import { WorkoutProgram } from '../workoutProgram';
import { WorkoutProgramSchedule } from '../workoutProgramSchedule';
import { WorkoutProgramScheduleType } from '../workoutProgramScheduleType';
import { WorkoutVideo } from '../workoutVideo';
import { Notice } from '../notice';
export default class BaseSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await connection.createQueryBuilder().delete().from(Gym).execute();
    await connection.createQueryBuilder().delete().from(MediaArticle).execute();
    await connection.createQueryBuilder().delete().from(WorkoutProgramSchedule).execute();
    await connection.createQueryBuilder().delete().from(WorkoutProgram).execute();
    await connection.createQueryBuilder().delete().from(WorkoutVideo).execute();
    await connection.createQueryBuilder().delete().from(WorkoutPart).execute();
    await connection.createQueryBuilder().delete().from(WorkoutCategory).execute();
    await connection.createQueryBuilder().delete().from(WorkoutProgramScheduleType).execute();
    await connection.createQueryBuilder().delete().from(Image).execute();
    await connection.createQueryBuilder().delete().from(UserSubscription).execute();
    await connection.createQueryBuilder().delete().from(User).execute();
    await connection.createQueryBuilder().delete().from(Notice).execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(
        connection.getRepository(User).create([
          {
            id: 1,
            userRole: UserRole.ADMIN,
            username: 'admin',
            email: '1234@12343.com',
            name: '관리자',
            password: '1234',
            phoneNumber: '12343',
          },
          {
            id: 2,
            userRole: UserRole.CUSTOMER,
            username: 'customer',
            email: '1234@12342.com',
            name: '일반고객',
            password: '1234',
            phoneNumber: '12344',
          },
          {
            id: 3,
            userRole: UserRole.GYM,
            username: 'gym',
            email: '1234@12341.com',
            name: '체육관',
            password: '1234',
            phoneNumber: '12345',
          },
        ]),
      )
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Gym)
      .values([
        {
          id: 1,
          name: '버프 문정점',
          address: '서울특별시 송파구 새말로8길 28',
          latitude: 37.4802658,
          longitude: 127.126618,
          phoneNumber1: '010-9100-1902',
        },
        {
          id: 2,
          name: '버프 강남점',
          address: '서울특별시 금천구 시흥1동 시흥대로 202 대의빌딩 지하 1층',
          latitude: 37.4802655,
          longitude: 127.126957,
          phoneNumber1: '02-2807-1125',
        },
        {
          id: 3,
          name: '버프 사당점',
          address: '서울특별시 서초구 서초동 1623-2번지',
          latitude: 37.4808332,
          longitude: 127.126868,
          phoneNumber1: '02-2525-5504',
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(MediaArticle)
      .values([
        {
          id: 1,
          title: '고강도운동 크로스핏은 어떻게 탄생되었을까?',
          body: '[FT 스포츠] 크로스핏은 짧은 시간 내에 온몸의 근육을 자극하고 다양한 운동을 혼합한 운동법으로 여러 사람들과 기록 경쟁을 할 수 있어서 지루하지 않고 1시간 안팎의 짧은 운동으로 민첩성과 유연성 지구력을 키우는 강도 높은 훈련이지만 인기가 높은 운동에 속한다.',
          mediaName: 'FT 스포츠',
          link: 'https://www.ftimes.kr/news/articleView.html?idxno=12574',
        },
        {
          id: 2,
          title: '영혼까지 갈아넣는 ‘45분’…시간없는 사람 위한 최적 운동',
          body: '10년 넘게 최소 주 4회 운동을 해왔던 내가 요즘 푹 빠진 운동이 있다. 전 세계적으로 가장 핫한 피트니스 브랜드 ‘에프45(F45) 트레이닝’이다. 무엇이 다르기에 전 지구적인 사랑을 받을까. 약 2700여 개에 달하는 동작을 매일 다르게 조합해 딱 45분간 운동하는데, 운동 효과와 강도는 운동선수조차 끝나고 나면 "죽을 맛"이라고 말할 정도로 강렬하다. 온 힘을 끌어모아 45분간 뛰고 나면, 남는 것은 흥건한 땀과 뜨거운 희열. 살아있음을 강하게 느껴보고 싶다면 이만한 것이 없다.',
          mediaName: '중앙일보',
          link: 'https://www.joongang.co.kr/article/24082961',
        },
        {
          id: 3,
          title: '혼자 운동하기 지칠 때, ‘크로스핏’ 어떤가요?',
          body: '최근 건강 관리의 필요성을 느끼는 이들이 많아지면서 자기 관리의 일환으로 운동을 시작하는 경우를 종종 볼 수 있다. 하지만 혼자 목표를 세우고 꾸준히 운동하기란 쉽지 않고 대부분 작심삼일을 넘기기 힘들어한다. 이에 단기간 고효율을 자랑하면서 의지까지 불태울 수 있는 운동인 크로스핏을 소개한다.',
          mediaName: '하이닥',
          link: 'https://mobile.hidoc.co.kr/healthstory/news/C0000523651',
        },
        {
          id: 4,
          title: `“100세 시대, 중요한 것은 체력” 62세 몸짱의 눈에 들어온 운동은…[양종구의 100세 건강법]`,
          body: '어수영 씨(62)는 건강에 빨간불이 들어와 시작한 운동을 통해 ‘제2의 인생’을 개척하고 있다. 은퇴를 앞두고 전남대 일반대학원 체육학과에서 운동생리학을 공부하며 자신과 같은 베이비부머 세대를 위한 건강관리 프로그램을 준비하고 있다.',
          mediaName: '동아일보',
          link: 'https://www.donga.com/news/It/article/all/20201107/103844661/1',
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(WorkoutCategory)
      .values([
        { id: 1, name: '랜덤' },
        { id: 2, name: '근력' },
        { id: 3, name: '유산소' },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(WorkoutPart)
      .values([
        { id: 1, name: '랜덤' },
        { id: 2, name: '상체' },
        { id: 3, name: '하체' },
        { id: 4, name: '전신' },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(WorkoutProgramScheduleType)
      .values([
        { id: 2, name: '근력' },
        { id: 3, name: '유산소' },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Image)
      .values([
        {
          id: 1,
          name: '커버이미지1',
          type: ImageType.WORKOUT_COVER,
          filePath: `/uploads/images/4.test.jpeg`,
          thumbnailPath: `/uploads/images/thumbs/4.test.jpeg`,
        },
        {
          id: 2,
          name: '운동간이미지',
          type: ImageType.WORKOUT_BREAK,
          filePath: `/uploads/images/2.test.jpeg`,
          thumbnailPath: `/uploads/images/thumbs/2.test.jpeg`,
        },
        {
          id: 3,
          name: '세트간이미지',
          type: ImageType.WORKOUT_BREAK,
          filePath: `/uploads/images/3.test.jpeg`,
          thumbnailPath: `/uploads/images/thumbs/3.test.jpeg`,
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(WorkoutVideo)
      .values([
        {
          id: 1,
          name: '윗몸일으키기',
          duration: 10,
          size: 123456,
          filePath: '/uploads/videos/workout/1.test.mp4',
          category: { id: 2 },
          part: { id: 2 },
          isWarmup: false,
        },
        {
          id: 2,
          name: '행잉레그레이즈',
          duration: 12,
          size: 232123,
          filePath: '/uploads/videos/workout/2.test.mp4',
          category: { id: 2 },
          part: { id: 2 },
          isWarmup: false,
        },
        {
          id: 3,
          name: '몸비틀기',
          duration: 12,
          size: 412971,
          filePath: '/uploads/videos/workout/3.test.mp4',
          category: { id: 2 },
          part: { id: 2 },
          isWarmup: false,
        },
        {
          id: 4,
          name: '장난치기',
          duration: 12,
          size: 412971,
          filePath: '/uploads/videos/workout/4.test.mp4',
          category: { id: 2 },
          part: { id: 2 },
          isWarmup: false,
        },
        {
          id: 5,
          name: '프레스',
          duration: 12,
          size: 412971,
          filePath: '/uploads/videos/workout/5.test.mp4',
          category: { id: 2 },
          part: { id: 2 },
          isWarmup: false,
        },
        {
          id: 6,
          name: '준비운동',
          duration: 12,
          size: 412971,
          filePath: '/uploads/videos/workout/6.test.mp4',
          category: { id: 2 },
          part: { id: 2 },
          isWarmup: true,
        },
      ])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(WorkoutProgram)
      .values([
        {
          id: 1,
          name: '복근튼튼프로젝트',
          preferCategory: { id: 2 },
          preferPart: { id: 2 },
          openDate: new Date('2021-10-16 00:00:00'),
          closeDate: new Date('2021-11-24 00:00:00'),
          coverImage: { id: 1 },
          workoutTimeSeconds: 5,
          setBreakTimeSeconds: 30,
          workoutBreakTimeSeconds: 5,
          setCount: 3,
          workoutBreakTimeImage: { id: 2 },
          warmupBreakTimeImage: { id: 2 },
          setBreakTimeImage: { id: 3 },
          warmUpVideos: [{ id: 6 }],
          warmupTimeSeconds: 10,
          warmupBreakTimeSeconds: 15,
        },
        {
          id: 2,
          name: '광배펼쳐버리기',
          preferCategory: { id: 2 },
          preferPart: { id: 2 },
          openDate: new Date('2021-10-16 00:00:00'),
          closeDate: new Date('2021-11-24 00:00:00'),
          coverImage: { id: 1 },
          workoutTimeSeconds: 5,
          setBreakTimeSeconds: 30,
          workoutBreakTimeSeconds: 5,
          setCount: 5,
          workoutBreakTimeImage: { id: 2 },
          warmupBreakTimeImage: { id: 2 },
          setBreakTimeImage: { id: 3 },
          warmUpVideos: [{ id: 3 }],
          warmupTimeSeconds: 10,
          warmupBreakTimeSeconds: 15,
        },
      ])
      .execute();
    await connection
      .createQueryBuilder()
      .insert()
      .into(Notice)
      .values([
        {
          id: 1,
          title: '버프 개장',
          body: '버프스튜디오 오픈 했읍니다',
        },
      ])
      .execute();
    // await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(WorkoutProgramSchedule)
    //   .values(
    //     connection.getRepository(WorkoutProgramSchedule).create([
    //       {
    //         id: 1,
    //         workoutProgram: { id: 1 },
    //         workoutProgramType: { id: 1 },
    //         year: 2021,
    //         month: 10,
    //         date: 19,
    //       },
    //       {
    //         id: 2,
    //         workoutProgram: { id: 1 },
    //         workoutProgramType: { id: 1 },
    //         year: 2021,
    //         month: 10,
    //         date: 20,
    //       },
    //       {
    //         id: 3,
    //         workoutProgram: { id: 1 },
    //         workoutProgramType: { id: 1 },
    //         year: 2021,
    //         month: 10,
    //         date: 21,
    //       },
    //     ]),
    //   )
    //   .execute();

    await connection.createQueryBuilder().relation(WorkoutProgram, 'workoutVideos').of(1).add([1, 2, 3, 4, 5]);
    await connection.createQueryBuilder().relation(WorkoutProgram, 'workoutVideos').of(2).add([1, 2, 5, 6]);
  }
}
