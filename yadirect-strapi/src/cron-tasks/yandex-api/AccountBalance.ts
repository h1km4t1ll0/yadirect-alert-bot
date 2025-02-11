export default class AccountBalance {
  accountId: string;
  agencyName: string;
  amount: number;
  currency: string;
  login: string;

  constructor(accountId: string, agencyName: string, amount: number, currency: string, login: string) {
    this.accountId = accountId;
    this.agencyName = agencyName;
    this.amount = amount;
    this.currency = currency;
    this.login = login;
  }

  static build(payload: any): AccountBalance | null {
    try {
      return new AccountBalance(
        payload['AccountID'],
        payload['AgencyName'],
        parseFloat(payload['Amount']),
        payload['Currency'],
        payload['Login']
      );
    } catch (e) {
      console.error('An error occurred while parsing account balance: ' + e);
      return null; // Return null in case of an error
    }
  }
}
