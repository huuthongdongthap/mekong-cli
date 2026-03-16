/**
 * 🌊 BLUE OCEAN - Đại Dương Xanh
 * 8 Planets Unified Module
 */

// ============================================
// 🔵 VENUS - UI/Design
// ============================================

export const colors = {
    primary: { 50: '#f0f9ff', 500: '#0ea5e9', 900: '#0c4a6e' },
    accent: { 50: '#faf5ff', 500: '#a855f7', 600: '#9333ea' },
    success: { 500: '#22c55e', 600: '#16a34a' },
    dark: { bg: '#0f172a', card: '#1e293b', border: '#334155' },
} as const;

export const gradients = {
    aura: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    vibe: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    ocean: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
} as const;

export const vibeClasses = {
    glass: 'backdrop-blur-xl bg-white/10 border border-white/20',
    gradientText: 'bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent',
    hoverScale: 'transition-transform hover:scale-105',
} as const;

// ============================================
// ⚪ URANUS - Analytics
// ============================================

export function formatVND(amount: number): string {
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)} triệu`;
    return amount.toLocaleString('vi-VN') + ' đ';
}

export function calculateGrowthMetrics(currentGMV: number, targetARR = 1_000_000) {
    const annualizedRunRate = currentGMV * 12;
    return {
        currentGMV,
        targetARR,
        annualizedRunRate,
        progress: (annualizedRunRate / targetARR) * 100,
        gap: Math.max(0, targetARR - annualizedRunRate),
    };
}

// ============================================
// 🟣 SATURN - Agents
// ============================================

export type AgentPhase = 'plan' | 'code' | 'ship';

export const AGENT_REGISTRY = [
    { id: 'project-manager', phase: 'plan' as AgentPhase, name: 'Project Manager' },
    { id: 'research-analyst', phase: 'plan' as AgentPhase, name: 'Research Analyst' },
    { id: 'fullstack-developer', phase: 'code' as AgentPhase, name: 'Fullstack Developer' },
    { id: 'code-reviewer', phase: 'code' as AgentPhase, name: 'Code Reviewer' },
    { id: 'devops-engineer', phase: 'ship' as AgentPhase, name: 'DevOps Engineer' },
    { id: 'qa-engineer', phase: 'ship' as AgentPhase, name: 'QA Engineer' },
];

// ============================================
// 🟠 JUPITER - CRM
// ============================================

export type DealTier = 'warrior' | 'general' | 'tuong_quan';

export const TIER_CONFIG: Record<DealTier, { retainer: number; equity: string }> = {
    warrior: { retainer: 2000, equity: '5-8%' },
    general: { retainer: 5000, equity: '3-5%' },
    tuong_quan: { retainer: 0, equity: '15-30%' },
};

export function validateWinWinWin(tier: DealTier) {
    const config = TIER_CONFIG[tier];
    return {
        ownerWin: `Equity ${config.equity} + $${config.retainer}/mo`,
        agencyWin: 'Deal flow + Knowledge',
        clientWin: 'Protection + Strategy',
        aligned: true,
    };
}

// ============================================
// 🔴 MARS - Ops
// ============================================

export const DEPLOY_COMMANDS = {
    link: 'wrangler login',
    pull: 'wrangler deploy --dry-run',
    build: 'npm run build',
    deploy: 'wrangler deploy',
};

// ============================================
// 🟢 EARTH - Dev
// ============================================

export type EvolutionStage = 'hat_giong' | 'cay' | 'rung' | 'dat';

export const EVOLUTION_TARGETS: Record<EvolutionStage, string> = {
    hat_giong: '🌱 Zero `as any`',
    cay: '🌲 Strict state',
    rung: '🌳 Sanitized logs',
    dat: '🏔️ 100% tests',
};

// ============================================
// 🟡 MERCURY - Marketing
// ============================================

export class ReferralEngine {
    private links = new Map<string, { clicks: number; earnings: number }>();

    generate(ownerId: string) {
        const code = `ref_${Math.random().toString(36).slice(2, 8)}`;
        this.links.set(code, { clicks: 0, earnings: 0 });
        return { code, ownerId };
    }

    track(code: string, value: number, rate = 0.1) {
        const link = this.links.get(code);
        if (link) {
            link.clicks++;
            link.earnings += value * rate;
        }
    }
}

// ============================================
// 🟤 NEPTUNE - Revenue
// ============================================

export const ARR_TARGET_2026 = 1_000_000;

export const EXCHANGE_RATES = { USD: 1, VND: 24500, THB: 35 };

export function toUSD(amount: number, currency: 'USD' | 'VND' | 'THB'): number {
    return amount / EXCHANGE_RATES[currency];
}

// ============================================
// PLANETS REGISTRY
// ============================================

export const PLANETS = [
    { id: 'venus', emoji: '🔵', name: 'UI/Design' },
    { id: 'uranus', emoji: '⚪', name: 'Analytics' },
    { id: 'saturn', emoji: '🟣', name: 'AI Agents' },
    { id: 'jupiter', emoji: '🟠', name: 'CRM/Sales' },
    { id: 'mars', emoji: '🔴', name: 'DevOps' },
    { id: 'earth', emoji: '🟢', name: 'Dev/Quality' },
    { id: 'mercury', emoji: '🟡', name: 'Marketing' },
    { id: 'neptune', emoji: '🟤', name: 'Finance' },
] as const;

export type Planet = typeof PLANETS[number]['id'];
