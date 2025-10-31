/* eslint-disable prettier/prettier */

export type ForgotPasswordFormValues = { username: string; otp: string };

export enum FORM_STEP {
  SEARCH,
  OTP,
}
