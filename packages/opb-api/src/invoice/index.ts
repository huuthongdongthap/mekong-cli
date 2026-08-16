import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createInvoiceSchema } from '../middleware/db';
import { authMiddleware } from '../auth';

type Bindings = { DB: D1Database; };
type Env = { DB: D1Database; };
const app = new Hono<{ Bindings: Env }>();

app.get('/', authMiddleware, async (c) => {
  const user = c.get('user');
  const { DB } = c.env;
  const invoices = await DB.prepare('SELECT id, invoice_no, customer_name, grand_total, status, created_at FROM invoices WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').bind(user.sub).all();
  return c.json({ invoices: invoices.results });
});

app.get('/:id', authMiddleware, async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const { DB } = c.env;
  const invoice = await DB.prepare('SELECT * FROM invoices WHERE id = ? AND user_id = ?').bind(id, user.sub).first();
  if (!invoice) return c.json({ error: 'Invoice not found' }, 404);
  const items = await DB.prepare('SELECT * FROM invoice_items WHERE invoice_id = ?').bind(id).all();
  return c.json({ invoice, items: items.results });
});

app.post('/', zValidator('json', createInvoiceSchema), authMiddleware, async (c) => {
  const data = c.req.valid('json');
  const user = c.get('user');
  const { DB } = c.env;

  const now = new Date();
  const prefix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const seqResult = await DB.prepare('SELECT COUNT(*) as count FROM invoices WHERE user_id = ? AND invoice_no LIKE ?').bind(user.sub, `${prefix}%`).first();
  const seq = String((seqResult?.count as number || 0) + 1).padStart(4, '0');
  const invoiceNo = `${prefix}/${String(user.sub).padStart(4, '0')}/${seq}`;

  let subtotal = 0, totalTax = 0;
  const itemTotals = data.items.map((item) => {
    const lt = item.quantity * item.unit_price;
    const ta = lt * (item.tax_rate / 100);
    subtotal += lt; totalTax += ta;
    return { description: item.description, quantity: item.quantity, unit_price: item.unit_price, tax_rate: item.tax_rate, line_total: lt, tax_amount: ta };
  });

  try {
    const result = await DB.prepare('INSERT INTO invoices (user_id, invoice_no, customer_name, customer_tax_id, customer_email, customer_phone, customer_address, subtotal, tax_amount, grand_total, notes, status, issued_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))').bind(user.sub, invoiceNo, data.customer_name, data.customer_tax_id || null, data.customer_email || null, data.customer_phone || null, data.customer_address || null, subtotal, totalTax, subtotal + totalTax, data.notes || null).run();
    const invoiceId = result.meta.last_row_id;
    const stmt = DB.prepare('INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, tax_rate, line_total, tax_amount) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const item of itemTotals) { await stmt.bind(invoiceId, item.description, item.quantity, item.unit_price, item.tax_rate, item.line_total, item.tax_amount).run(); }
    await DB.prepare('UPDATE users SET credits = credits - 5 WHERE id = ?').bind(user.sub).run();
    return c.json({ id: invoiceId, invoice_no: invoiceNo, total: subtotal + totalTax, status: 'issued' }, 201);
  } catch (err) {
    console.error('Invoice creation error:', err);
    return c.json({ error: 'Failed to create invoice' }, 500);
  }
});

app.delete('/:id', authMiddleware, async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const { DB } = c.env;
  const invoice = await DB.prepare('SELECT status FROM invoices WHERE id = ? AND user_id = ?').bind(id, user.sub).first();
  if (!invoice) return c.json({ error: 'Not found' }, 404);
  if ((invoice.status as string) === 'void') return c.json({ error: 'Already voided' }, 400);
  await DB.prepare("UPDATE invoices SET status = 'void' WHERE id = ?").bind(id).run();
  return c.json({ success: true, status: 'void' });
});

export default app;
