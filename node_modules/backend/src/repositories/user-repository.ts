import { prisma } from './prisma.js';

export interface CreateUserData {
  username: string;
  passwordHash: string;
  name: string;
  roleCodes: string[];
}

export class UserRepository {
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async create(data: CreateUserData) {
    // Find matching role records
    const roles = await prisma.role.findMany({
      where: {
        code: { in: data.roleCodes }
      }
    });

    return prisma.user.create({
      data: {
        username: data.username,
        passwordHash: data.passwordHash,
        name: data.name,
        roles: {
          create: roles.map(role => ({
            roleId: role.id
          }))
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }
}
