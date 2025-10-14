import { INestApplicationContext } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext | object,
    private corsOptions: CorsOptions,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: Record<string, unknown>) {
    return super.createIOServer(port, {
      ...options,
      cors: this.corsOptions,
    }) as unknown;
  }
}
