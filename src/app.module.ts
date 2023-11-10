import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './authentication/auth.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [UserModule, AuthModule, TodoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
