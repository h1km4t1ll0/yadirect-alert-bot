import logging


class AccountBalance:
    account_id: str
    agency_name: str
    amount: int
    currency: str
    login: str

    @staticmethod
    def build(payload: dict):
        try:
            account_total = AccountBalance()

            account_total.account_id = payload['AccountID']
            account_total.agency_name = payload['AgencyName']
            account_total.amount = float(payload['Amount'])
            account_total.currency = payload['Currency']
            account_total.account_id = payload['AccountID']
            account_total.login = payload['Login']

            return account_total
        except Exception as e:
            logging.error('An error occurred while parsing campaign:' + str(e))
