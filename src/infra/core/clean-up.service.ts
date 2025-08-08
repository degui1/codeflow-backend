import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'node:fs';
import { resolve } from 'node:path';

import { EnvService } from '../env/env.service';

@Injectable()
export class CleanUpService {
  private readonly logger = new Logger(CleanUpService.name);

  constructor(private envService: EnvService) {}

  private cleanFolder(path: string) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file) => {
        const curPath = resolve(path, file);

        if (fs.lstatSync(curPath).isDirectory()) {
          this.cleanFolder(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleCron() {
    const temporaryFolder = resolve(this.envService.get('TEMPORARY_FOLDER'));

    this.cleanFolder(temporaryFolder);

    this.logger.log('Temporary folder cleaned up');
  }
}
