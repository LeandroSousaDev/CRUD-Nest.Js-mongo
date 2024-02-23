import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {

    const { password, ...userData } = createUserDto

    const bcryptPass = await bcrypt.hash(password, 10)

    const user = { ...userData, password: bcryptPass }

    await this.prisma.users.create({
      data: user
    })

    return { ...userData, password: undefined }
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(id: string) {
    return this.prisma.users.findUniqueOrThrow({
      where: {
        id
      }
    })
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.users.update({
      where: { id },
      data: updateUserDto
    })
  }

  remove(id: string) {
    return this.prisma.users.delete({
      where: { id }
    })
  }

  findByEmail(email: string) {
    return this.prisma.users.findUniqueOrThrow({
      where: {
        email
      }
    })
  }
}
