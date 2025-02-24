import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import * as path from "path";
import * as fs from "fs";
import { Multer } from 'multer';
import { join } from "path";

/* import { AwsS3Service } from "./aws-s3.service"; */ // 서버 구동시 활성화

import { Workbook } from './workbooks.entity';
import { Academy } from '../academy/academy.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { UploadBookDto } from '../dto/uploadWorkbook.dto';

@Injectable()
export class WorkbookService {
  private readonly logger = new Logger(WorkbookService.name);
  constructor (
    @InjectRepository(Workbook)
    private workbookRepository: Repository<Workbook>,
    @InjectRepository(Academy)
    private academyRepository: Repository<Academy>,
    private readonly firebaseService : FirebaseService,
    /* private readonly awsS3Service: AwsS3Service, */
  ) {}
  //booklist update
  async getWorkbookList(academyId: string)
  {
    this.logger.log(academyId);
    const academy = await this.academyRepository.findOne({ where : { academyId : academyId } });

    if(!academy)
    {
      throw new Error('학원정보가 없습니다');
    }

    const startMonth = academy.startMonth;

    const workbooks = await this.workbookRepository.find({
      where : {
        releaseMonth : MoreThan(startMonth),
      }, 
      select : ['workbookId', 'workbookName', 'Difficulty', 'storageLink'],
    });
    return workbooks;
  }
  //전체 문제집 불러오기
  async getWorkbookTotalList()
  {
    const workbooks = await this.workbookRepository.find();
    return workbooks;
  }
  //workbookDownload
  async getWorkbookDownload(storageLink: string): Promise<string>
  {
    this.logger.log(storageLink);
    const filePath = path.resolve(storageLink);

    if (!fs.existsSync(filePath)) {
      throw new Error('파일을 찾을 수 없습니다.');
    }

    return filePath;
  }
  //workbook upload
  async uploadWorkbook(data)
  {
    console.log('문제집 업로드 완료');

    const userDeviceToken = 'test';
    const title = '새 문제집이 업로드되었습니다!';
    const body = '문제집을 확인하려면 앱을 열어보세요.';

    await this.firebaseService.sendNotification(userDeviceToken, title, body);
  }

  async uploadWorkbookFile(data: UploadBookDto, file: Multer.file)
  {
    console.log("📌 받은 데이터:", data);
    console.log("📁 받은 파일:", file?.originalname);

    let filePath = null;

    if(file)
    {
      filePath = join(__dirname, "..", "..", "uploads", file.filename);
      console.log("📂 파일 저장 경로:", filePath);
    }
    /* // AWS S3로 업로드
    let fileUrl = null;
    if (file) {
      fileUrl = await this.awsS3Service.uploadFile(file);
      console.log("📂 AWS S3 업로드 완료:", fileUrl);
    } */

    const newWorkbook = {
      releaseMonth: data.releaseMonth,
      workbookName: data.workbookName,
      Difficulty: data.Difficulty,
      isPaid: data.isPaid,
      storageLink: filePath,
    }

    const savedWorkbook = await this.workbookRepository.save(newWorkbook);
    return { message: "업로드 완료!", data: savedWorkbook };
  }
}
