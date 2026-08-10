import { AuthService } from './auth.service';
import { StripePaymentAdapter, PaystackPaymentAdapter, FlutterwavePaymentAdapter } from '../../common/abstractions/payment.abstract';
import { OpenAiAdapter, AnthropicAdapter, GeminiAdapter } from '../../common/abstractions/ai-provider.abstract';

describe('Phase 1 Service Specifications', () => {
  describe('Payment Provider Abstraction Layer', () => {
    it('should process payments across Stripe, Paystack, and Flutterwave without coupling', async () => {
      const stripe = new StripePaymentAdapter();
      const paystack = new PaystackPaymentAdapter();
      const flutterwave = new FlutterwavePaymentAdapter();

      const stripeRes = await stripe.processPayment({ amount: 50, currency: 'USD', customerEmail: 'author@test.com' });
      expect(stripeRes.success).toBe(true);
      expect(stripeRes.provider).toBe('STRIPE');
      expect(stripeRes.transactionRef).toContain('str_tx_');

      const paystackRes = await paystack.processPayment({ amount: 25000, currency: 'NGN', customerEmail: 'author@test.ng' });
      expect(paystackRes.success).toBe(true);
      expect(paystackRes.provider).toBe('PAYSTACK');
      expect(paystackRes.transactionRef).toContain('pst_tx_');

      const flwRes = await flutterwave.processPayment({ amount: 100, currency: 'USD', customerEmail: 'author@test.com' });
      expect(flwRes.success).toBe(true);
      expect(flwRes.provider).toBe('FLUTTERWAVE');
      expect(flwRes.transactionRef).toContain('flw_tx_');
    });
  });

  describe('AI Provider Abstraction Layer', () => {
    it('should route requests across OpenAI, Anthropic, and Gemini seamlessly', async () => {
      const openai = new OpenAiAdapter();
      const anthropic = new AnthropicAdapter();
      const gemini = new GeminiAdapter();

      const prompt = 'Proofread this academic abstract on quantum mechanics.';

      const openAiRes = await openai.generateText({ prompt, mode: 'SUGGESTION' });
      expect(openAiRes.provider).toBe('OPENAI');
      expect(openAiRes.outputType).toBe('SUGGESTION');
      expect(openAiRes.content).toContain('Proofread');

      const anthropicRes = await anthropic.generateText({ prompt, mode: 'RECOMMENDATION' });
      expect(anthropicRes.provider).toBe('ANTHROPIC');
      expect(anthropicRes.outputType).toBe('RECOMMENDATION');

      const geminiRes = await gemini.generateText({ prompt, mode: 'FACT' });
      expect(geminiRes.provider).toBe('GEMINI');
      expect(geminiRes.outputType).toBe('FACT');
    });
  });
});
