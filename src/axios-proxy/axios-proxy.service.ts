import { Injectable, HttpService } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class AxiosProxyService {
  private readonly proxyConfig: AxiosRequestConfig = {
    proxy: {
      host: '45.196.48.9',
      port: 5435,
      auth: {
        username: 'jtzhwqur',
        password: 'jnf0t0n2tecg',
      },
    },
  };

  constructor(private readonly httpService: HttpService) {}

  async makeRequest(url: string): Promise<any> {
    const response = await this.httpService.get(url, this.proxyConfig).toPromise();
    return response.data;
  }
}
