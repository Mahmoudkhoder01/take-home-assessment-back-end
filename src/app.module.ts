import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
