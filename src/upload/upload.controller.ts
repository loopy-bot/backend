import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

const filePath = 'uploads';
const chunkPath = filePath + '/chunks_';
@Controller('file')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
    }),
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    const fileName = body.name.match(/(.+)\-\d+$/)[1];
    const chunkDir = chunkPath + fileName;

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(files[0].path, chunkDir + '/' + body.name);
    fs.rmSync(files[0].path);
  }

  @Get('merge')
  merge(@Query('name') name: string) {
    try {
      const chunkDir = chunkPath + name;
      const files = fs.readdirSync(chunkDir);

      let startPos = 0,
        count = 0;
      files
        .sort((a, b) => +a.split('-')[1] - +b.split('-')[1])
        .map((file) => {
          const filePath = chunkDir + '/' + file;
          const stream = fs.createReadStream(filePath);
          stream
            .pipe(
              fs.createWriteStream('uploads/' + name, {
                start: startPos,
              }),
            )
            .on('finish', () => {
              count++;

              if (count === files.length) {
                fs.rm(
                  chunkDir,
                  {
                    recursive: true,
                  },
                  () => {},
                );
              }
            });

          startPos += fs.statSync(filePath).size;
        });
      return name;
    } catch (error) {
      return error;
    }
  }
}
