import logging

from yandexDirectBot.src.utils import format_number


class AccountStatistics:
    clicks: int
    impressions: int
    conversions: int
    cost: float
    cost_with_vat: float
    error_message: str | None = None
    cost_per_conversion: list[dict[str, str]] | None = None

    def set_cost_with_vat(self, payload: str):
        rows = payload.split('\n')

        try:
            yandex_direct_data = rows[2].split('\t')
            self.cost_with_vat = int(yandex_direct_data[0]) / 1000000
        except Exception as e:
            logging.error('An error occurred while parsing cost with vat: ' + str(e) + 'Payload: ' + payload)
            self.cost_with_vat = 0

    @staticmethod
    def build(payload: str, goals: list[dict[str, str]] | None = None):
        account_statistics = AccountStatistics()

        rows = payload.split('\n')

        try:
            yandex_direct_data = rows[2].split('\t')
            account_statistics.clicks = format_number(int(yandex_direct_data[0]))
            account_statistics.impressions = format_number(int(yandex_direct_data[1]))
            account_statistics.cost = format_number(int(yandex_direct_data[2]) / 1000000)

            if goals is not None:
                offset = 3
                goal_length = len(goals)

                account_statistics.conversions = sum(
                    map(
                        lambda conversion: int(conversion) if conversion != '--' else 0,
                        yandex_direct_data[offset:offset + goal_length]
                    )
                )
                offset += goal_length
                cost_per_conversion_list = list(yandex_direct_data[offset:offset + goal_length])

                account_statistics.cost_per_conversion = []
                for i in range(0, len(cost_per_conversion_list)):
                    account_statistics.cost_per_conversion.append(
                        {
                            'goal': goals[i]['name'],
                            'cost': format_number(
                                int(cost_per_conversion_list[i]) / 1000000 if cost_per_conversion_list[i] != '--' else 0
                            )
                        }
                    )
            else:
                account_statistics.conversions = int(yandex_direct_data[2])
        except Exception as e:
            account_statistics.error_message = str(e)
            account_statistics.clicks = 0
            account_statistics.impressions = 0
            account_statistics.conversions = 0
            account_statistics.cost = 0

            logging.error('An error occurred while parsing report: ' + str(e) + ' Payload: ' + payload)

        return account_statistics
