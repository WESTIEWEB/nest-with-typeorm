import { DateTime } from 'luxon';
import * as crypto from 'crypto';

export const generateRandomNumber = () => {
  const otp = Math.floor(Math.random() * 1000000);
  return otp;
};

export const generateOtpExpiry = () => {
  const expiry = DateTime.now();
  return expiry.plus({ minutes: 30 });
};

export const generateRandomNumbers = (length: number): number => {
  const maxNumber = Math.pow(10, length) - 1;
  const randomNumber = Math.floor(Math.random() * maxNumber);
  return randomNumber;
};
