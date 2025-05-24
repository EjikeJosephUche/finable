import { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { ICard } from "../interfaces/card.interface";
import { encrypt, decrypt } from "../utils/encryptionUtils";

const CardSchema = new Schema<ICard>({
  cardNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => /^\d{16}(:[a-f0-9]+)?$/.test(v),
      message: () => `Card number must be 16 digits`,
    },
  },
  CVV: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d{3}(:[a-f0-9]+)?$/.test(v),
      message: () => `CVV must be 3 digits`,
    },
  },
  expiryDate: {
    type: String,
    required: true,
    match: [/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"],
  },
});

CardSchema.pre("save", function (next) {
  if (this.isModified("cardNumber")) this.cardNumber = encrypt(this.cardNumber);
  if (this.isModified("CVV")) this.CVV = encrypt(this.CVV);
  next();
});

CardSchema.methods.decryptFields = function () {
  return {
    cardNumber: decrypt(this.cardNumber),
    CVV: decrypt(this.CVV),
    expiryDate: this.expiryDate,
  };
};

export default CardSchema;
