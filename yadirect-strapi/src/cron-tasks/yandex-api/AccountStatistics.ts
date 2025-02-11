import { formatNumber } from './utils'; // Assuming formatNumber is imported from a utility module

interface GoalData {
  goal: string;
  cost: string;
  conversions: number;
}

export default class AccountStatistics {
  clicks: number | string;
  impressions: number | string;
  conversions: number | string;
  cost: number | string;
  costWithVat: number | string;
  errorMessage: string | null = null;
  goalsData: GoalData[] | null = null;

  constructor() {
    this.clicks = 0;
    this.impressions = 0;
    this.conversions = 0;
    this.cost = 0;
    this.costWithVat = 0;
  }

  setCostWithVat(payload: string): void {
    const rows = payload.split('\n');
    try {
      const yandexDirectData = rows[2].split('\t');
      this.costWithVat = formatNumber(parseInt(yandexDirectData[0], 10) / 1000000);
    } catch (e) {
      console.error('An error occurred while parsing cost with VAT: ' + e + ' Payload: ' + payload);
      this.costWithVat = 0;
    }
  }

  static build(payload: string, goals: {name: string, goalId: string}[] | null = null): AccountStatistics {
    const accountStatistics = new AccountStatistics();
    const rows = payload.split('\n');
    try {
      const yandexDirectData = rows[2].split('\t');
      accountStatistics.clicks = formatNumber(parseInt(yandexDirectData[0], 10));
      accountStatistics.impressions = formatNumber(parseInt(yandexDirectData[1], 10));
      accountStatistics.cost = formatNumber(parseInt(yandexDirectData[2], 10) / 1000000);

      if (goals && goals.length > 0) {
        let offset = 3;
        const goalLength = goals.length;
        accountStatistics.conversions = goals.reduce((sum, _, index) => {
          const conversion = yandexDirectData[offset + index];
          return sum + (conversion !== '--' ? parseInt(conversion, 10) : 0);
        }, 0);

        offset += goalLength;
        const costPerConversionList = yandexDirectData.slice(offset, offset + goalLength);
        accountStatistics.goalsData = [];

        for (let i = 0; i < costPerConversionList.length; i++) {
          const conversions = yandexDirectData[offset - goalLength + i];
          accountStatistics.goalsData.push({
            goal: goals[i].name,
            cost: formatNumber(costPerConversionList[i] !== '--' ? parseInt(costPerConversionList[i], 10) / 1000000 : 0),
            conversions: conversions !== '--' ? parseInt(conversions, 10) : 0,
          });
        }
      } else {
        accountStatistics.conversions = parseInt(yandexDirectData[3], 10);
      }
    } catch (e) {
      accountStatistics.errorMessage = String(e);
      console.error('An error occurred while parsing report: ' + e + ' Payload: ' + payload);
    }
    return accountStatistics;
  }
}
