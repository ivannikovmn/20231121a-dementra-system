import { Controller, Get } from '@nestjs/common';
import { AxiosProxyService } from './axios-proxy.service';

@Controller('axios-proxy')
export class AxiosProxyController {
  constructor(private readonly axiosProxyService: AxiosProxyService) {}

  @Get()
  async makeRequest() {
    const result = await this.axiosProxyService.makeRequest('https://example.com');
    return { message: 'Success', data: result };
  }
}
