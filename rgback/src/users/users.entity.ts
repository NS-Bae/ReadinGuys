import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Academy } from '../academy/academy.entity'; // Academy 엔티티를 만든 경우

export enum UserType {
  원장 = '원장',
  교사 = '교사',
  학생 = '학생',
}

@Entity('Users') // 테이블 이름을 Users로 설정
export class User {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  userName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  academyId: string;

  @ManyToOne(() => Academy, (academy) => academy.academyId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'AcademyID' })
  academy: Academy;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: false,
  })
  userType: UserType;

  @Column({ type: 'boolean', nullable: false })
  ok: boolean;
}
