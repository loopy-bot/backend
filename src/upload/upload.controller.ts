import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
    }),
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log(files);
    const fileName = body.name.match(/(.+)\-\d+$/)[1];
    const chunkDir = 'uploads/chunks_' + fileName;

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(files[0].path, chunkDir + '/' + body.name);
    fs.rmSync(files[0].path);
  }
}
