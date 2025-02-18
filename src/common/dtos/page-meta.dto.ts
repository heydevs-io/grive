import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class PageMetaDto {
  constructor({
    page,
    take,
    itemCount,
    recommendBegin,
  }: {
    page: number;
    take: number;
    itemCount: number;
    recommendBegin?: number | undefined;
  }) {
    this.page = page;
    this.take = take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;

    if (recommendBegin !== undefined) {
      this.recommendBegin = recommendBegin;
    } else {
      this.recommendBegin = null;
    }
  }

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 1 })
  page: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 10 })
  take: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 100 })
  itemCount: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 10 })
  pageCount: number;

  @Expose()
  @IsBoolean()
  @ApiProperty({ example: false })
  hasPreviousPage: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @Expose()
  @IsNumber()
  @IsOptional()
  recommendBegin: number | null;
}
