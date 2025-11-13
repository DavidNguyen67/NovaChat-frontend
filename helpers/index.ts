/* eslint-disable prettier/prettier */

export const getUrlMedia = (url: string) => {
  // return process.env.MEDIA_ENDPOINT + url;
  return url;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 ** 2) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else if (sizeInBytes < 1024 ** 3) {
    return `${(sizeInBytes / 1024 ** 2).toFixed(1)} MB`;
  } else {
    return `${(sizeInBytes / 1024 ** 3).toFixed(1)} GB`;
  }
};

export const getFileIcon = (type?: string, name?: string) => {
  const ext = name?.split('.').pop()?.toLowerCase() ?? '';

  // Ưu tiên nhận diện theo MIME type
  if (type?.startsWith('image/')) return 'mdi:file-image';
  if (type?.startsWith('video/')) return 'mdi:file-video';
  if (type?.startsWith('audio/')) return 'mdi:file-music';
  if (type?.startsWith('text/')) return 'mdi:file-document-outline';
  if (type?.includes('pdf')) return 'mdi:file-pdf-box';
  if (type?.includes('zip') || type?.includes('compressed'))
    return 'mdi:folder-zip-outline';

  switch (ext) {
    // Code files
    case 'js':
    case 'jsx':
      return 'mdi:language-javascript';
    case 'ts':
    case 'tsx':
      return 'mdi:language-typescript';
    case 'py':
      return 'mdi:language-python';
    case 'java':
      return 'mdi:language-java';
    case 'cs':
      return 'mdi:language-csharp';
    case 'cpp':
    case 'cc':
    case 'c':
      return 'mdi:language-cpp';
    case 'html':
      return 'mdi:language-html5';
    case 'css':
      return 'mdi:language-css3';
    case 'json':
      return 'mdi:code-json';
    case 'sql':
      return 'mdi:database-outline';
    case 'sh':
    case 'bash':
      return 'mdi:console-line';

    // Documents
    case 'pdf':
      return 'mdi:file-pdf-box';
    case 'doc':
    case 'docx':
      return 'mdi:file-word-box';
    case 'xls':
    case 'xlsx':
      return 'mdi:file-excel-box';
    case 'ppt':
    case 'pptx':
      return 'mdi:file-powerpoint-box';
    case 'txt':
    case 'md':
      return 'mdi:file-document-outline';

    // Archives
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
      return 'mdi:folder-zip-outline';

    // Design/media
    case 'psd':
      return 'mdi:adobe-photoshop';
    case 'ai':
      return 'mdi:adobe-illustrator';
    case 'fig':
      return 'mdi:file-image';
    case 'svg':
      return 'mdi:vector-square';

    default:
      return 'mdi:file-outline';
  }
};

export const blobUrlToFile = (blobUrl: string): Promise<File> =>
  new Promise((resolve) => {
    fetch(blobUrl).then((res) => {
      res.blob().then((blob) => {
        const file = new File([blob], 'file.extension', { type: blob.type });

        resolve(file);
      });
    });
  });

export const formatNumber = (
  value?: number | string,
  options?: {
    digit?: number;
    offsetRate?: number;
    toFixed?: boolean;
    failoverValue?: string;
    isSkipRound?: boolean;
    floor?: boolean;
    showPlusPrefix?: boolean;
    showMiniPrefix?: boolean;
  },
) => {
  const {
    digit,
    offsetRate,
    toFixed,
    failoverValue,
    isSkipRound,
    floor,
    showPlusPrefix,
    showMiniPrefix,
  } = options ?? {};

  if (value == null || isNaN(Number(value))) {
    return failoverValue ?? '0';
  }

  let data = Number(value);

  if (offsetRate != null) {
    data = data / offsetRate;
  }

  let tempValueString = data.toString();
  let prefix = showPlusPrefix ? '+' : showMiniPrefix ? '-' : '';

  if (tempValueString.startsWith('-')) {
    prefix = '-';
    tempValueString = tempValueString.substring(1, tempValueString.length);
  }

  try {
    const tempValue = Number(tempValueString);
    const fractionDigit = digit ?? 0;

    let mainNum = Number(`${Number(tempValue.toString())}e+${fractionDigit}`);

    if (!isSkipRound) {
      mainNum = floor ? Math.floor(mainNum) : Math.round(mainNum);
    }
    const thousandSeparator = '.';
    const decimalSeparator = '.';
    const newDecimalSeparator = ',';

    if (fractionDigit > 0) {
      const temp = +`${mainNum}e-${fractionDigit}`;
      let fractionString = '';
      let i = '';

      if (toFixed) {
        i = temp.toFixed(fractionDigit);
        fractionString = i.substring(i.indexOf(decimalSeparator), i.length);
        i = i.substring(0, i.indexOf(decimalSeparator));

        return (
          prefix +
          i.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
          fractionString.replace(decimalSeparator, newDecimalSeparator)
        );
      }

      i = temp.toString();
      if (temp.toString().indexOf(decimalSeparator) >= 1) {
        fractionString = temp
          .toString()
          .substring(
            temp.toString().indexOf(decimalSeparator),
            temp.toString().length,
          );
        i = temp
          .toString()
          .substring(0, temp.toString().indexOf(decimalSeparator));
      }

      return (
        prefix +
        i.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        fractionString.replace(decimalSeparator, newDecimalSeparator)
      );
    }

    const temp = +`${mainNum}e-${fractionDigit}`;
    const i = temp.toString();

    return prefix + i.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  } catch {
    return '';
  }
};
