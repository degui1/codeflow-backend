import { Injectable } from '@nestjs/common';

import { PublicPost } from 'src/domain/repositories/posts.repository';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class PostsFactory {
  constructor(private prisma: PrismaService) {}

  // async makePublicPosts(): Promise<PublicPost[]> {
  //   const posts = this.prisma.post.createMany({data: {}})

  //   return posts;
  // }
}
