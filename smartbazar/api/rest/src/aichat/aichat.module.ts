// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { AiChatController } from './aichat.controller';
import { AiChatService } from './aichat.service';

@Module({
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiChat {}
