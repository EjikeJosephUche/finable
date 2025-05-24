import { Document } from "mongoose";
import { ICard } from "./card.interface";
export interface IAccount extends Document {
  firstName: string;
  surname: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  accountNumber: string;
  decryptFields?(): { phoneNumber: string; dateOfBirth: string };
  card: ICard;
}

export interface IDecryptedAccount {
  firstName: string;
  surname: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  accountNumber: string;
  card: {
    cardNumber: string;
    CVV: string;
    expiryDate: string;
  };
}
