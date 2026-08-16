import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { taxCalcSchema } from '../middleware/db';
import { authMiddleware } from '../auth';

type Bindings = { DB: D1Database; };
const app = new Hono<{ Bindings: Bindings }>();

const TNCN_BRACKETS = [
  { min: 0, max: 5_000_000, rate: 0.05, deduction: 0 },
  { min: 5_000_000, max: 10_000_000, rate: 0.10, deduction: 250_000 },
  { min: 10_000_000, max: 18_000_000, rate: 0.15, deduction: 750_000 },
  { min: 18_000_000, max: 32_000_000, rate: 0.20, deduction: 1_650_000 },
  { min: 32_000_000, max: 52_000_000, rate: 0.25, deduction: 3_250_000 },
  { min: 52_000_000, max: 80_000_000, rate: 0.30, deduction: 5_850_000 },
  { min: 80_000_000, max: Infinity, rate: 0.35, deduction: 9_850_000 },
];

app.post('/calculate', zValidator('json', taxCalcSchema), authMiddleware, async (c) => {
  const { income_vnd, type, period, deductions } = c.req.valid('json');
  const user = c.get('user');
  const { DB } = c.env;
  let result: any;

  if (type === 'tncn') {
    const ins = (deductions?.insurance_social || 0) + (deductions?.insurance_health || 0);
    const dep = (deductions?.dependents || 0) * 4_400_000;
    const totalDed = ins + dep + (deductions?.other_deductions || 0);
    const taxable = Math.max(0, income_vnd - totalDed);
    let tax = 0, rem = taxable;
    for (const b of TNCN_BRACKETS) { if (rem <= 0) break; const range = b.max === Infinity ? rem : Math.min(rem, b.max - b.min); tax += range * b.rate; rem -= range; }
    result = { type: 'tncn', gross_income: income_vnd, deductions: { social: ins, health: deductions?.insurance_health || 0, dependents: dep, other: deductions?.other_deductions || 0, total: totalDed }, taxable_income: taxable, tax_amount: Math.round(tax), effective_rate: (taxable > 0 ? ((tax / income_vnd) * 100).toFixed(2) : '0'), net_income: income_vnd - Math.round(tax) };
  } else if (type === 'tndn') {
    const ded = income_vnd * 0.10;
    const taxable = income_vnd - ded;
    const tax = taxable * 0.20;
    result = { type: 'tndn', revenue: income_vnd, deductible: ded, taxable_income: taxable, tax_rate: '20%', tax_amount: Math.round(tax), net_income: Math.round(income_vnd - tax) };
  } else if (type === 'gtgt') {
    const exempt = income_vnd < 100_000_000;
    result = { type: 'gtgt', revenue: income_vnd, rate: exempt ? '0% (exempt)' : '10%', vat_amount: exempt ? 0 : Math.round(income_vnd * 0.10), vat_exempt: exempt, total_with_vat: exempt ? income_vnd : income_vnd + Math.round(income_vnd * 0.10), note: exempt ? 'Miễn thuế GTGT cho doanh thu < 100M' : '' };
  }

  await DB.prepare('INSERT INTO tax_calculations (user_id, type, input_data, result, period, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))').bind(user.sub, type, JSON.stringify({ income_vnd, type, period, deductions }), JSON.stringify(result), period).run();
  await DB.prepare('UPDATE users SET credits = credits - 2 WHERE id = ?').bind(user.sub).run();
  return c.json(result);
});

app.get('/history', authMiddleware, async (c) => {
  const user = c.get('user');
  const { DB } = c.env;
  const history = await DB.prepare('SELECT id, type, period, result, created_at FROM tax_calculations WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').bind(user.sub).all();
  return c.json({ calculations: history.results });
});

export default app;
