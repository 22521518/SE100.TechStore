import { IsNumber, IsString } from 'class-validator';

export class CallbackMomoDto {
  @IsString()
  partnerCode: string;

  @IsString()
  orderId: string;

  @IsString()
  requerequestIdstId: string;

  @IsString()
  amount: string;

  @IsString()
  orderInfo: string;

  @IsString()
  orderType: string;

  @IsString()
  transId: number;

  @IsNumber()
  resultCode: number;

  @IsString()
  message: string;

  @IsString()
  payType: string;

  @IsString()
  responseTime: number;

  @IsString()
  extraData: string;

  @IsString()
  signature: string;
}
