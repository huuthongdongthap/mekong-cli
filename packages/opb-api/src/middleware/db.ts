/**
 * D1 Database middleware for Hono.js
 * Provides db binding to all routes
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export type D1Env = {
  DB: D1Database;
};

export type Env = {
  DB: D1Database;
  JWT_SECRET: string;
  OPENROUTER_KEY: string;
  MOMO_PARTNER_CODE: string;
  MOMO_ACCESS_KEY: string;
  MOMO_SECRET_KEY: string;
  ZALO_APP_ID: string;
  ZALO_APP_SECRET: string;
  VIETQR_API_URL: string;
  VIETQR_API_KEY: string;
};

export const withDb = <T extends Record<string, any>>(app: Hono<T>) => {
  app.use('*', async (c, next) => {
    c.set('db', c.env.DB);
    await next();
  });
  return app;
};

// Zod schemas for validation
export const createInvoiceSchema = z.object({
  customer_name: z.string().min(1).max(255),
  customer_tax_id: z.string().optional(),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().optional(),
  customer_address: z.string().optional(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unit_price: z.number().positive(),
    tax_rate: z.number().min(0).max(100).default(0),
  })).min(1),
  notes: z.string().optional(),
  due_days: z.number().min(0).default(30),
});

export const signupSchema = z.object({
  name: z.string().min(1).max(255),
  zalo_id: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  business_type: z.enum(['freelancer', 'shop_owner', 'service_provider', 'other']),
  company_name: z.string().optional(),
});

export const taxCalcSchema = z.object({
  income_vnd: z.number().positive(),
  type: z.enum(['tncn', 'tndn', 'gtgt']),
  period: z.enum(['monthly', 'quarterly', 'yearly']),
  deductions: z.object({
    insurance_social: z.number().optional().default(0),
    insurance_health: z.number().optional().default(0),
    dependents: z.number().optional().default(0),
    other_deductions: z.number().optional().default(0),
  }).optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type TaxCalcInput = z.infer<typeof taxCalcSchema>;
