import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cron } from "@nestjs/schedule";

import { Academy } from "./academy.entity";
@Injectable()
export class AcademyService
{
  private readonly logger = new Logger(AcademyService.name);
  constructor(
    @InjectRepository(Academy)
    private academyRepository: Repository<Academy>,
  ) {}

  //매월 첫째 날 00시 10분에 가동. 구독비용을 지불했는지의 상태값을 바꿈
  @Cron('10 0 1 * *')
  async checkExpiredAcademies()
  {
    const currentDate = new Date();
    const expiredAcademies = await this.academyRepository
      .createQueryBuilder()
      .where('endDate < :currentDate', { currentDate })
      .andWhere('paymentStatus = :paymentStatus', { paymentStatus: true })
      .getMany();

    for(const academy of expiredAcademies)
    {
      academy.paymentStatus = false;
      await this.academyRepository.save(academy);
    }
  }

  async findAll(): Promise<Academy[]>
  {
    return await this.academyRepository.find();
  }

  async findOne(academyId: string): Promise<Academy>
  {
    return await this.academyRepository.findOne({where : {academyId}});
  }
  /* 
  async getStartMonth(): Promise<Date> {
    const academy = await this.academyRepository.findOne({where : {}})
  } */
}