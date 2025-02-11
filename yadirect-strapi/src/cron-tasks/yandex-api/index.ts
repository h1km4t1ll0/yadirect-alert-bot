import axios from 'axios';
import AccountBalance from './AccountBalance'; // Assuming AccountBalance is imported from a module
import AccountStatistics from './AccountStatistics'; // Assuming AccountStatistics is imported from a module
import {v4 as uuidv4} from 'uuid'; // For generating UUIDs
import {DateTime} from 'luxon'; // For date handling

export class YandexDirectAPI {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = 'https://api.direct.yandex.ru';
  }

  private async safelyExecuteRequest(apiUrl: string, body: string, headers: any = null): Promise<any> {
    const retryIn = 5; // Define your retry interval in seconds
    while (true) {
      try {
        const response = await axios.post(apiUrl, body, {headers});
        // response.data.encoding = 'utf-8'; // Ensure response is treated as UTF-8

        switch (response.status) {
          case 400:
            console.error("Параметры запроса указаны неверно или достигнут лимит отчетов в очереди");
            return response;
          case 200:
            console.log("Отчет создан успешно");
            console.log(`RequestId: ${response.headers['RequestId'] || 'N/A'}`);
            return response;
          case 201:
            console.log("Отчет успешно поставлен в очередь в режиме офлайн");
            await this.sleep(retryIn);
            break;
          case 202:
            console.log("Отчет формируется в режиме офлайн");
            await this.sleep(retryIn);
            break;
          case 500:
            console.error("При формировании отчета произошла ошибка. Пожалуйста, попробуйте повторить запрос позднее");
            return response;
          case 502:
            console.error("Время формирования отчета превысило серверное ограничение.");
            return response;
          default:
            console.error("Произошла непредвиденная ошибка");
            return response;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  public async getAccountBalance(token: string): Promise<AccountBalance> {
    console.log(token, 'token')
    const body = {
      param: {Action: "Get"},
      method: "AccountManagement",
      token: token
    };
    const headers = {
      Authorization: `Bearer ${token}`,
      'Accept-Language': 'ru',
      processingMode: 'auto'
    };
    const response = await axios.post(`${this.apiUrl}/live/v4/json`, JSON.stringify(body, null, 4), {headers});
    return AccountBalance.build(response.data.data.Accounts[0]);
  }

  public async getAccountReport(token: string, dateFrom: string, goals: {name: string, goalId: string}[] | null = null): Promise<AccountStatistics> {
    const bodyRaw = {
      method: "get",
      params: {
        SelectionCriteria: {
          DateFrom: dateFrom,
          DateTo: DateTime.now().toFormat('yyyy-MM-dd')
        },
        FieldNames: ["Clicks", "Impressions", "Cost", "Conversions"],
        ReportType: "CUSTOM_REPORT",
        DateRangeType: "CUSTOM_DATE",
        IncludeVAT: 'NO',
        ReportName: `report-${uuidv4()}`,
        Format: "TSV",
        IncludeDiscount: "NO"
      }
    };
    const headers = {
      Authorization: `Bearer ${token}`,
      'Accept-Language': 'ru',
      processingMode: 'auto'
    };

    if (goals && goals.length > 0) {
      bodyRaw.params['Goals'] = goals.map((goal) => goal.goalId);
      bodyRaw.params.FieldNames.push("CostPerConversion");
    }

    const body = JSON.stringify(bodyRaw, null, 4);
    const req = await this.safelyExecuteRequest(`${this.apiUrl}/json/v5/reports`, body, headers);
    const accountStatistics = AccountStatistics.build(req.data, goals);

    bodyRaw.params.IncludeVAT = 'YES';
    bodyRaw.params.FieldNames = ["Cost"];
    bodyRaw.params.ReportName = `report-${uuidv4()}`;
    const bodyWithVAT = JSON.stringify(bodyRaw, null, 4);
    const reqWithVAT = await this.safelyExecuteRequest(`${this.apiUrl}/json/v5/reports`, bodyWithVAT, headers);
    accountStatistics.setCostWithVat(reqWithVAT.data);

    return accountStatistics;
  }
}
