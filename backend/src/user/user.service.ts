import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PublicUser } from '@shared/types/user.types'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<PublicUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return user
  }
}
