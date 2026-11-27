const coachingPlans = new Set(['basic', 'standard', 'premium']);

export function isLaunchOfferPlan(plan) {
  return coachingPlans.has(String(plan ?? '').toLowerCase());
}

export function getLaunchOffer(now, config) {
  const startsAt = Date.parse(config?.startsAt);
  const duration = Number(config?.durationHours) * 60 * 60 * 1000;
  const endsAt = startsAt + duration;

  if (!Number.isFinite(now) || !Number.isFinite(endsAt) || duration <= 0) {
    return { status: 'disabled', active: false, remainingMs: 0 };
  }

  const status = now < startsAt ? 'upcoming' : now < endsAt ? 'active' : 'expired';
  return {
    status,
    active: status === 'active',
    startsAt,
    endsAt,
    remainingMs: status === 'active' ? endsAt - now : 0,
  };
}

export function buildBookingMessage({ en, plan, installments = false, offerActive = false }) {
  const training = plan === 'Training Plan';
  let message;

  if (en) {
    const action = plan ? `book ${plan}` : 'ask about coaching packages';
    const payment = training
      ? 'EGP 100, one-time purchase'
      : installments ? 'payment in 3 installments' : 'full payment';
    message = `Hi Ahmed, I'd like to ${action}${plan ? ` — ${payment}` : ''}.`;
  } else {
    const payment = installments ? 'الدفع على ٣ دفعات' : 'الدفع كاملًا';
    const action = training
      ? 'أحجز جدول تدريبي فقط — ١٠٠ جنيه'
      : plan ? `أحجز باقة ${plan} — ${payment}` : 'أستفسر عن باقات التدريب';
    message = `أهلًا كابتن أحمد، حابب ${action}.`;
  }

  if (offerActive && isLaunchOfferPlan(plan)) {
    message += en
      ? ' With the website launch offer: 3 months + 1 free month at the same package price.'
      : ' مع عرض إطلاق الموقع: ٣ شهور + شهر مجاني بنفس سعر الباقة.';
  }

  return message;
}
