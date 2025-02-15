import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { AcceptOfferModule } from './accept-offer/accept-offer.module';
import { CategoryModule } from './category/category.module';
import { ChatModule } from './chat/chat.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JobsModule,
    UsersModule,
    AuthModule,
    // AcceptOfferModule,
    CategoryModule,
    ChatModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
