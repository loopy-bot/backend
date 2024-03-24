import { Between, FindManyOptions, Repository } from 'typeorm';

export class PaginationParams {
  page: number;
  pageSize: number;
}

export const getTimestamp = (startTime: number, endTime: number) => {
  return Between(startTime, endTime);
};

export const pagingQuery = async <Entity, Conditions>(
  paginationParams: PaginationParams,
  conditions: Conditions,
  repository: Repository<Entity>,
) => {
  const page = +paginationParams.page;
  const pageSize = +paginationParams.pageSize;

  const options: FindManyOptions = {
    take: pageSize,
    skip: (page - 1) * pageSize,
    where: Object.entries(conditions).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {}),
  };

  const result = await repository.findAndCount(options);
  return {
    page,
    pageSize,
    content: result[0],
    total: result[1],
  };
};
