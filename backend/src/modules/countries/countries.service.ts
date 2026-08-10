import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: string) {
    if (query) {
      return this.prisma.country.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { isoCode: { contains: query } },
            { region: { contains: query } },
          ],
        },
        orderBy: { name: 'asc' },
      });
    }

    return this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByCode(isoCode: string) {
    return this.prisma.country.findUnique({
      where: { isoCode: isoCode.toUpperCase() },
      include: {
        policies: true,
        services: true,
      },
    });
  }
}
