export interface PaymentChargeOptions {
  amount: number;
  currency: string;
  customerEmail: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionRef: string;
  provider: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE';
  amount: number;
  currency: string;
  rawResponse?: any;
}

export abstract class PaymentProviderAdapter {
  abstract readonly name: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE';
  abstract processPayment(options: PaymentChargeOptions): Promise<PaymentResult>;
  abstract verifyWebhook(payload: any, signature: string): Promise<boolean>;
}

export class StripePaymentAdapter extends PaymentProviderAdapter {
  readonly name = 'STRIPE';
  async processPayment(options: PaymentChargeOptions): Promise<PaymentResult> {
    const mockRef = `str_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      success: true,
      transactionRef: mockRef,
      provider: 'STRIPE',
      amount: options.amount,
      currency: options.currency,
      rawResponse: { status: 'succeeded', chargeId: mockRef },
    };
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    return true;
  }
}

export class PaystackPaymentAdapter extends PaymentProviderAdapter {
  readonly name = 'PAYSTACK';
  async processPayment(options: PaymentChargeOptions): Promise<PaymentResult> {
    const mockRef = `pst_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      success: true,
      transactionRef: mockRef,
      provider: 'PAYSTACK',
      amount: options.amount,
      currency: options.currency,
      rawResponse: { status: 'success', reference: mockRef },
    };
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    return true;
  }
}

export class FlutterwavePaymentAdapter extends PaymentProviderAdapter {
  readonly name = 'FLUTTERWAVE';
  async processPayment(options: PaymentChargeOptions): Promise<PaymentResult> {
    const mockRef = `flw_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      success: true,
      transactionRef: mockRef,
      provider: 'FLUTTERWAVE',
      amount: options.amount,
      currency: options.currency,
      rawResponse: { status: 'successful', tx_ref: mockRef },
    };
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    return true;
  }
}
