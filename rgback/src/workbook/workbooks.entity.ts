import { Entity, Column, PrimaryColumn } from 'typeorm';

export enum Difficulty {
  쉬움 = 'easy',
  중간 = 'normal',
  어려움 = 'hard',
}

@Entity( 'Workbooks' )
export class Workbook {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  workbookId: string;

  @Column({ type: 'boolean', nullable: false })
  isPaid: boolean;

  @Column({
    type: 'enum',
    enum: Difficulty,
    nullable: false,
  })
  Difficulty: Difficulty;

  @Column({ type: 'varchar', length: 255, nullable: false })
  workbookName: string;

  @Column({ type: 'date', nullable: false })
  releaseMonth: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  storageLink: string;
}