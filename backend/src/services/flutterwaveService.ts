const API_ROOT = 'https://api.flutterwave.com/v3';

const secretKey = () => {
  if (!process.env.FLW_SECRET_KEY) throw new Error('Flutterwave payments are not configured');
  return process.env.FLW_SECRET_KEY;
};

const request = async <T>(path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: AbortSignal.timeout(15000),
  });
  const body = await response.json() as T & { message?: string };
  if (!response.ok) throw new Error(body.message || `Payment provider request failed (${response.status})`);
  return body;
};

export type VerifiedTransaction = {
  status: string;
  message?: string;
  data?: {
    id: number;
    tx_ref: string;
    amount: number;
    charged_amount?: number;
    currency: string;
    status: string;
    payment_type?: string;
  };
};

export const createPaymentLink = (payload: Record<string, unknown>) => request<{ status: string; message: string; data?: { link?: string } }>('/payments', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const verifyProviderTransaction = (transactionId: string | number) =>
  request<VerifiedTransaction>(`/transactions/${encodeURIComponent(String(transactionId))}/verify`);
