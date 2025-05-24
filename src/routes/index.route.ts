import { Router } from "express";
import AccountController from "../controllers/account.controller";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/account", (req, res) => {
  AccountController.createAccount(req, res);
});
router.get("/account", (req, res) => {
  AccountController.getAllAccounts(req, res);
});
router.get("/account/decrypted", (req, res) => {
  AccountController.getAllDecryptedAccounts(req, res);
});

router.get("/account/encryptedanddecrypted", (req, res) => {
  AccountController.getEncryptedAndDecryptedAccounts(req, res);
});
router.get("/account/:hash", (req, res) => {
  AccountController.getDecryptedDataFields(req, res);
});
// router.get("/account/:email", (req, res) => {
//   AccountController.getAccountByEmail(req, res);
// });

export default router;
