/**
 * 🛡️ VIBE Hardened - Deployment Logic
 * Updated: 2026-03-16 - Migrated from Vercel to Cloudflare
 */
export interface DeployConfig {
    project: string;
    environment: 'development' | 'staging' | 'production';
    cloudflareProjectId?: string;
}

export const DEPLOY_COMMANDS = {
    link: 'wrangler login',
    pull: 'wrangler deploy --dry-run',
    build: 'npm run build',
    deploy: 'wrangler deploy',
    logs: 'wrangler tail',
};

export function getDeployCommand(env: DeployConfig['environment']): string {
    if (env === 'production') return DEPLOY_COMMANDS.deploy;
    return `wrangler deploy --env ${env}`;
}
