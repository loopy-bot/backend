import { PaginationParams } from 'src/utils/pagingQuery';

export class PaginationTaskDto implements PaginationParams {
  page: number;
  pageSize: number;
  startTime: number;
  endTime: number;
  name: string;
}
