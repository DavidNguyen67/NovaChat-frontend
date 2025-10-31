/* eslint-disable prettier/prettier */

export const getUrlMedia = (url: string) => {
  // return process.env.MEDIA_ENDPOINT + url;
  return url;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
