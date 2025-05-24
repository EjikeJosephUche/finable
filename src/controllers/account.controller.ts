import { Request, Response } from "express";
import AccountService from "../services/account.service";
// import { IAccount } from '../models/account.model';
// import { ICardGenerator } from '../models/card.model';
import { IAccount } from "../interfaces/account.interface";
import { accountValidator } from "../validators/account.validator";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

class AccountController {
  async createAccount(req: Request, res: Response): Promise<void> {
    const validation = accountValidator.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        message: "invalid input",
        errors: validation.error.flatten().fieldErrors,
      });
    }
    try {
      // const accountData = validation.data as IAccount;
      const account = await AccountService.createAccount(
        validation.data as IAccount
      );
      res.status(201).json(account);
    } catch (error: any) {
      if (res.headersSent) {
        return;
      }
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      const accounts = await AccountService.getAllAccountsEncrypted();
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching accounts", error });
    }
  }

  async getAllDecryptedAccounts(req: Request, res: Response): Promise<void> {
    try {
      const accounts = await AccountService.getAllDecryptedAccounts();
      if (accounts === null) {
        res.status(404).json({ message: "No accounts found" });
        return;
      }
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching decrypted accounts",
      });
    }
  }

  async getEncryptedAndDecryptedAccounts(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const accounts = await AccountService.getEncryptedAndDecryptedAccounts();
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching encrypted and decrypted accounts",
        error,
      });
    }
  }
  async getDecryptedDataFields(req: Request, res: Response): Promise<void> {
    try {
      const { hash } = req.params;
      const decryptedAccount = await AccountService.getDecryptedData_fields(
        hash
      );
      // res.status(404).json({ message: "Account not found" });
      // return;
      res.status(200).json(decryptedAccount);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching account", error });
    }

    // async getDecryptedDataFields(req: Request, res: Response): Promise<void> {
    //   try {
    //     const { hash } = req.body;
    //     const decryptedFields = await AccountService.getDecryptedData_fields(hash);
    //     res.status(200).json(decryptedFields);
    //   } catch (error) {
    //     res
    //       .status(500)
    //       .json({ message: "Error fetching decrypted card fields", error });
    //   }
    // }

    // async getAccountByEmail(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { email } = req.params;
    //         const account = await AccountService.getAccountByEmail(email);
    //         if (!account) {
    //             res.status(404).json({ message: 'Account not found' });
    //             return;
    //         }
    //         res.status(200).json(account);
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error fetching account', error });
    //     }
    // }
  }
}
export default new AccountController();
function getDecryptedDataFields(
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  Request: {
    new (input: RequestInfo | URL, init?: RequestInit): globalThis.Request;
    prototype: globalThis.Request;
  },
  res: Response<any, Record<string, any>>,
  Response: {
    new (body?: BodyInit | null, init?: ResponseInit): globalThis.Response;
    prototype: globalThis.Response;
    error(): globalThis.Response;
    json(data: any, init?: ResponseInit): globalThis.Response;
    redirect(url: string | URL, status?: number): globalThis.Response;
  }
) {
  throw new Error("Function not implemented.");
}
