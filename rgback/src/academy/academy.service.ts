import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Academy } from "./academy.entity";
import { Repository } from "typeorm";


@Injectable()
export class AcademyService
{
  constructor(
    @InjectRepository(Academy)
    private academyRepository: Repository<Academy>,
  ) {}
  /* 
  async getStartMonth(): Promise<Date> {
    const academy = await this.academyRepository.findOne({where : {}})
  } */
}