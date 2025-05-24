import accountModel from "../models/account.model";
class generators {
  async generateAccountNumber(): Promise<string> {
    const prefix = "20";
    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 100000000);
      const paddedNumber = String(randomNumber).padStart(8, "0");
      const accountNumber = `${prefix}${paddedNumber}`;
      const existingAccount = await accountModel.findOne({
        accountNumber: accountNumber,
      });
      if (!existingAccount) {
        return `${prefix}${paddedNumber}`;
      }
    }
    throw new Error("Failed to generate a unique account number");
  }

  async generateCardNumber(): Promise<string> {
    const prefix = "4"; // Visa card prefix
    const cardNumber = `${prefix}${Math.floor(
      Math.random() * 1000000000000000
    )}`;
    return cardNumber.replace(/\D/g, "");
  }
  async generateCVV(): Promise<string> {
    const cvv = Math.floor(Math.random() * 900) + 100; // 3-digit CVV
    return String(cvv).replace(/\D/g, "");
  }
  async generateExpiryDate(): Promise<string> {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear() + 3).slice(-2); // 3 years from now
    const expiryDate = `${month}/${year}`;
    return expiryDate;
  }
}
export default new generators();
