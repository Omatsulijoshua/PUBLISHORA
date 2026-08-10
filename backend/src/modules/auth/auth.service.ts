import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

export type RoleName =
  | 'PUBLIC_USER'
  | 'AUTHOR'
  | 'RESEARCHER'
  | 'ACADEMIC'
  | 'EDITOR'
  | 'PEER_REVIEWER'
  | 'JOURNAL_EDITOR'
  | 'PUBLISHER_ADMIN'
  | 'PRODUCTION_EDITOR'
  | 'DESIGNER'
  | 'COPYEDITOR'
  | 'UNIVERSITY_ADMIN'
  | 'ORGANIZATION_ADMIN'
  | 'SUPER_ADMIN'
  | 'SUPPORT_AGENT';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        countryCode: dto.countryCode || 'US',
        phoneNumber: dto.phoneNumber,
        userRoles: {
          create: [
            { role: 'PUBLIC_USER' as RoleName },
            { role: 'AUTHOR' as RoleName },
          ],
        },
        profile: {
          create: {
            isPublic: true,
          },
        },
      },
      include: {
        userRoles: true,
        profile: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.email, user.userRoles.map((r) => r.role));

    // Audit log entry
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        resource: `User:${user.id}`,
        metadataJson: JSON.stringify({ email: user.email, countryCode: user.countryCode }),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.userRoles.map((r) => r.role),
        activeMode: user.activeMode,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { userRoles: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.userRoles.map((r) => r.role);
    const tokens = this.generateTokens(user.id, user.email, roles);

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGGED_IN',
        resource: `User:${user.id}`,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        activeMode: user.activeMode,
      },
      ...tokens,
    };
  }

  private generateTokens(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
