import Compressor from 'compressorjs';

export const handleImage = async (
  file: File,
  callback: ({ name, url }: { name: string; url: string }) => void
) => {
  const reader = (readFile: File) =>
    new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.readAsDataURL(readFile);
    });

  new Compressor(file, {
    quality: 0.8,
    maxWidth: 500,
    maxHeight: 500,
    resize: 'contain',
    async success() {
      await reader(file).then((result: string) => {
        callback({ name: file?.name, url: result });
      });
    },
    error(error) {
      console.error('Error reading file:', error);
    }
  });
};
