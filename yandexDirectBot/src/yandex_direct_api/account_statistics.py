import logging


class AccountStatistics:
    clicks: int
    impressions: int
    conversions: int
    cost: float
    error_message: str | None = None

    @staticmethod
    def build(payload: str):
        account_statistics = AccountStatistics()

        rows = payload.split('\n')

        try:
            yandex_direct_data = rows[2].split('\t')
            account_statistics.clicks = int(yandex_direct_data[0])
            account_statistics.impressions = int(yandex_direct_data[1])
            account_statistics.conversions = int(yandex_direct_data[2])
            account_statistics.cost = int(yandex_direct_data[3]) / 1000000
        except Exception as e:
            account_statistics.error_message = str(e)
            account_statistics.clicks = 0
            account_statistics.impressions = 0
            account_statistics.conversions = 0
            account_statistics.cost = 0

            logging.error('An error occurred while parsing report:' + str(e) + 'Payload: ' + payload)

        return account_statistics
