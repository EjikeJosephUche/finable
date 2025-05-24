import { Document } from "mongoose";
interface ICard extends Document {
  userId?: object;
  cardNumber: string;
  CVV: string;
  expiryDate: string;
  decryptFields?(): { cardNumber: string; CVV: string; expiryDate: string };
}

interface ICardGenerator {
  cardNumber: string;
  CVV: string;
  expiryDate: string;
}
export { ICard, ICardGenerator };
