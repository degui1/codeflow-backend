import {
  existsSync,
  lstatSync,
  readdirSync,
  rmdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { createZipFile } from 'src/core/utils/create-zip-file';

import { EnvService } from '../env/env.service';
import { CustomLoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class CleanUpService {
  constructor(
    private envService: EnvService,
    private logger: CustomLoggerService,
  ) {}

  private cleanFolder(path: string) {
    if (!existsSync(path)) return;

    readdirSync(path).forEach((file) => {
      const curPath = resolve(path, file);

      if (lstatSync(curPath).isDirectory()) {
        this.cleanFolder(curPath);
      } else {
        unlinkSync(curPath);
      }
    });
    rmdirSync(path);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleCron() {
    const filesFolder = resolve(this.envService.get('FILES_FOLDER'));

    this.cleanFolder(filesFolder);

    this.logger.log('Files folder cleaned up', 'NestApplication');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  zipLogFiles(): void {
    const logDir = resolve(this.envService.get('LOG_FOLDER'));

    if (!existsSync(logDir)) return;

    const filesInLogFolder = readdirSync(logDir);
    const filesPathToZip: string[] = [];

    let logFileCreatedAt: Date = new Date();

    filesInLogFolder.forEach((file) => {
      if (extname(file) === '.log') {
        const filePath = join(logDir, file);

        filesPathToZip.push(filePath);

        if (file === this.envService.get('LOG_FILENAME')) {
          logFileCreatedAt = statSync(filePath).birthtime;
        }
      }
    });

    if (!filesPathToZip.length) return;

    const timeStamp = logFileCreatedAt.getTime();

    createZipFile({
      filesPathToZip,
      folderPathToSaveZipFile: logDir,
      zipFilename: `logs_${timeStamp}`,
    });

    this.logger.verbose(
      `Log files added to zip at ${new Date().toUTCString()}`,
    );

    filesPathToZip.forEach((filePath) => {
      rmSync(filePath);
    });
  }
}
