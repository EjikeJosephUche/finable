import { IAccount, IDecryptedAccount } from "../interfaces/account.interface";
import { ICardGenerator } from "../interfaces/card.interface";
import accountModel from "../models/account.model";
import { decrypt } from "../utils/encryptionUtils";
import generators from "./generatorUtils";

class AccountService {
  async createAccount(accountData: IAccount): Promise<IAccount> {
    try {
      const accountNumber = await generators.generateAccountNumber();
      const cardNumber = await generators.generateCardNumber();
      const CVV = await generators.generateCVV();
      const expiryDate = await generators.generateExpiryDate();
      const card: ICardGenerator = {
        cardNumber,
        CVV,
        expiryDate,
      };
      const fullName = `${accountData.firstName} ${accountData.surname}`;
      const existingAccount = await accountModel.findOne({
        email: accountData.email,
      });
      if (existingAccount) {
        throw new Error("Account with this email already exists");
      }
      const account = new accountModel({
        ...accountData,
        fullName,
        accountNumber,
        card,
      });

      await account.save();
      return account;
    } catch (error: any) {
      throw new Error(`Error creating account: ${error.message}`);
    }
  }

  async getAllAccountsEncrypted(): Promise<IAccount[]> {
    try {
      const accounts = await accountModel.find();
      return accounts;
    } catch (error: any) {
      throw new Error("Error fetching accounts: " + error.message);
    }
  }
  async getAccountByEmail(email: string): Promise<IAccount | null> {
    if (!email) {
      throw new Error("Email is required");
    }

    try {
      const account = await accountModel.findOne({ email });
      return account;
    } catch (error: any) {
      throw new Error("Error fetching account: " + error.message);
    }
  }

  async getAllDecryptedAccounts(): Promise<IDecryptedAccount[] | null> {
    try {
      const accounts = await accountModel.find();
      if (!accounts || accounts.length === 0) {
        return null;
      }
      const decryptedAccountsWithCard = accounts.map((account) => {
        const accountObj = account.toObject();
        let decryptedAccountFields = {};
        if (typeof account.decryptFields === "function") {
          decryptedAccountFields = account.decryptFields();
        } else {
          throw new Error("Account decryption not found");
        }
        const card = account.card;
        if (typeof card.decryptFields !== "function") {
          throw new Error("Card decryption not found");
        }
        const decryptedCardFields = card.decryptFields();
        return {
          ...accountObj,
          ...decryptedAccountFields,
          card: {
            ...decryptedCardFields,
          },
        };
      });

      return decryptedAccountsWithCard;
    } catch (error: any) {
      throw new Error("Error fetching accounts: " + error.message);
    }
  }

  async getEncryptedAndDecryptedAccounts(): Promise<{
    decryptedAccount: IDecryptedAccount[] | null;
    encryptedAccounts: IAccount[];
  }> {
    try {
      const encryptedAccounts = await this.getAllAccountsEncrypted();
      if (!encryptedAccounts || encryptedAccounts.length === 0) {
        throw new Error("No accounts found");
      }
      const decryptedAccount = await this.getAllDecryptedAccounts();
      if (!decryptedAccount || decryptedAccount.length === 0) {
        throw new Error("No accounts found");
      }

      return { encryptedAccounts, decryptedAccount };
    } catch (error: any) {
      throw new Error("Error fetching accounts: " + error.message);
    }
  }

  async getDecryptedData_fields(hash: string): Promise<string> {
    const account = decrypt(hash);
    if (!account) {
      throw new Error("Decryption failed");
    }
    return account;
  }
}

export default new AccountService();
