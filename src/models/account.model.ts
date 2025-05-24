import { IAccount } from "../interfaces/account.interface";
import mongoose, { Schema } from "mongoose";
import { encrypt, decrypt } from "../utils/encryptionUtils";
import dotenv from "dotenv";
dotenv.config();
import CardSchema from "./card.model";

const accountSchema = new Schema<IAccount>({
  firstName: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  card: { type: CardSchema, required: true },
});
accountSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});
accountSchema.pre("save", function (next) {
  if (this.isModified("phoneNumber")) {
    this.phoneNumber = encrypt(this.phoneNumber);
    next();
  }
  if (this.isModified("dateOfBirth")) {
    this.dateOfBirth = encrypt(this.dateOfBirth);
  }
  if (!this.isModified("accountNumber")) {
    return next();
  }
  this.accountNumber = this.accountNumber.replace(/\D/g, "");
  next();
});

accountSchema.methods.decryptFields = function () {
  return {
    phoneNumber: decrypt(this.phoneNumber),
    dateOfBirth: decrypt(this.dateOfBirth),
  };
};

const accountModel = mongoose.model<IAccount>("User", accountSchema);
export default accountModel;
