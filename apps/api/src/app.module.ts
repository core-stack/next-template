import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { JobModule } from "./modules/job/job.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { PrismaService } from "./modules/prisma/prisma.service";
import { StorageModule } from "./modules/storage/storage.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: "localhost",
        port: 6379,
      },
    }),
    WorkspaceModule,
    JobModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
