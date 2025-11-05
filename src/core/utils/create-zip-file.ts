import { join, resolve } from 'node:path';
import * as AdmZip from 'adm-zip';

interface ICreateZipFile {
  filesPathToZip: string[];
  folderPathToSaveZipFile: string;
  zipFilename?: string;
}

export function createZipFile({
  filesPathToZip,
  folderPathToSaveZipFile,
  zipFilename,
}: ICreateZipFile): string {
  const fullPathZipFile = join(folderPathToSaveZipFile, `${zipFilename}.zip`);

  const zip = new AdmZip();
  const resolvedPathToSaveZipFile = resolve(fullPathZipFile);

  filesPathToZip.forEach((filePath) => {
    const resolvedPath = resolve(filePath);

    zip.addLocalFile(resolvedPath);
    zip.writeZip(resolvedPathToSaveZipFile);
  });

  return resolvedPathToSaveZipFile;
}
