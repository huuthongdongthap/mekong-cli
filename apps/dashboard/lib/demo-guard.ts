import { NextResponse } from 'next/server';

export function isDashboardDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
}

export function resolveEngineApiUrl(): string {
  return process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://localhost:8000';
}

export function guardDashboardApiRoute(
  request: Request,
  options?: { allowSyntheticGet?: boolean }
): NextResponse | null {
  if (isDashboardDemoMode()) {
    if (request.method === 'GET' && options?.allowSyntheticGet) {
      return null;
    }
    return NextResponse.json(
      { error: 'Endpoint disabled in demo mode' },
      { status: 403 }
    );
  }

  const expectedToken = process.env.DASHBOARD_API_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { error: 'Server authentication token not configured' },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ') || authHeader.slice(7) !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
