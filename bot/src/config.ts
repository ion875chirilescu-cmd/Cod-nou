import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`\n❌ Lipsește variabila de mediu „${name}".`);
    console.error('   Copiază bot/.env.example în bot/.env și completează valorile.\n');
    process.exit(1);
  }
  return value;
}

/** ID-urile admin permise. Gol = acces public. */
const adminIds = (process.env.ADMIN_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map(Number)
  .filter((n) => Number.isFinite(n));

export const config = {
  botToken: required('TELEGRAM_BOT_TOKEN'),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  adminIds,
  /** Numele afișat al afacerii — folosit în mesaje și de către AI. */
  businessName: 'SELECT BARBER & SELECT ACADEMY',
};

export const aiEnabled = config.anthropicApiKey.length > 0;
