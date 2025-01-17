import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  findAll() {
    return {
      totalYearSaleByMonth: [
        {
          total: 52349,
        },
        {
          total: 63484,
        },
        {
          total: 48394,
        },
        {
          total: 37465,
        },
        {
          total: 42388,
        },
        {
          total: 48390,
        },
        {
          total: 56749,
        },
        {
          total: 74939,
        },
        {
          total: 69843,
        },
        {
          total: 71293,
        },
        {
          total: 64832,
        },
        {
          total: 54638,
        },
      ],
    };
  }
}
