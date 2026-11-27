import React, { createContext, useContext, useEffect, useState } from 'react';
import config from '../site.config.json';
import { getLaunchOffer } from './launchOffer.mjs';

const LaunchOfferContext = createContext(null);

export function LaunchOfferProvider({ children }) {
  const [now, setNow] = useState(() => Date.now());
  const offer = getLaunchOffer(now, config.launchOffer);

  useEffect(() => {
    let delay;
    if (offer.status === 'upcoming') {
      delay = Math.min(offer.startsAt - now, 60_000);
    } else if (offer.active) {
      delay = Math.min(offer.remainingMs, 1000);
    } else {
      return;
    }

    const timer = setTimeout(() => setNow(Date.now()), Math.max(delay, 1));
    return () => clearTimeout(timer);
  }, [now, offer.status, offer.startsAt, offer.active, offer.remainingMs]);

  useEffect(() => {
    const sync = () => setNow(Date.now());
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return <LaunchOfferContext.Provider value={offer}>{children}</LaunchOfferContext.Provider>;
}

export function useLaunchOffer() {
  return useContext(LaunchOfferContext);
}

function formatCairoDate(timestamp, en) {
  return new Intl.DateTimeFormat(en ? 'en-GB' : 'ar-EG', {
    timeZone: 'Africa/Cairo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(timestamp);
}

export function LaunchOfferBanner({ en }) {
  const offer = useLaunchOffer();
  if (offer.status !== 'upcoming' && !offer.active) return null;

  const date = offer.active ? offer.endsAt : offer.startsAt;
  const seconds = Math.ceil(offer.remainingMs / 1000);
  const countdown = [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ].map(value => String(value).padStart(2, '0')).join(' : ');

  return (
    <aside className="launch-offer" dir={en ? 'ltr' : 'rtl'} aria-label={en ? 'Website launch offer' : 'عرض إطلاق الموقع'}>
      <div className="launch-offer-copy">
        <span className="launch-offer-label">{en ? 'Website launch offer · 48 hours' : 'بمناسبة إطلاق الموقع · عرض لمدة ٤٨ ساعة'}</span>
        <h3>{en ? '3 months + 1 free month. Same price.' : '٣ شهور + شهر مجاني. بنفس السعر.'}</h3>
        <p>{en ? 'On Basic, Standard and Premium, with full payment or 3 installments.' : <>على <bdi dir="ltr">Basic</bdi> و<bdi dir="ltr">Standard</bdi> و<bdi dir="ltr">Premium</bdi>، مع الدفع الكامل أو ٣ دفعات.</>}</p>
        <p className="launch-offer-date">
          {offer.active ? (en ? 'Ends ' : 'ينتهي ') : (en ? 'Starts ' : 'يبدأ ')}
          <time dateTime={new Date(date).toISOString()}>{formatCairoDate(date, en)}</time>
          {en ? ' · Cairo time' : ' · بتوقيت القاهرة'}
        </p>
      </div>
      {offer.active && (
        <div className="launch-offer-clock">
          <span>{en ? 'Time remaining' : 'فاضل على نهاية العرض'}</span>
          <strong role="timer" aria-live="off" dir="ltr" aria-label={en ? 'Hours, minutes, seconds' : 'ساعات، دقائق، ثواني'}>{countdown}</strong>
          <span>{en ? 'hours : minutes : seconds' : 'ساعة : دقيقة : ثانية'}</span>
        </div>
      )}
    </aside>
  );
}

export function LaunchOfferBonus({ en }) {
  const { active } = useLaunchOffer();
  if (!active) return null;
  return <p className="plan-offer">{en ? '+ 1 free month · Launch offer' : '+ شهر مجاني · عرض الإطلاق'}</p>;
}

export function LaunchOfferFAQ({ en }) {
  const { active } = useLaunchOffer();
  if (!active) return null;
  return (
    <details>
      <summary>{en ? 'How does the launch offer work?' : 'عرض الإطلاق بيشتغل إزاي؟'}<span>+</span></summary>
      <p>{en
        ? 'Book Basic, Standard or Premium during the 48-hour launch offer to get 3 months plus 1 free month at the same price. The offer applies to full payment and 3 installments. The EGP 100 training plan is a separate one-time purchase.'
        : 'احجز واحدة من باقات المتابعة الثلاثة خلال عرض الإطلاق وخد ٣ شهور ومعاهم شهر مجاني بنفس السعر، سواء بالدفع الكامل أو ٣ دفعات. الجدول التدريبي بـ١٠٠ جنيه يفضل شراء مستقل لمرة واحدة.'}</p>
    </details>
  );
}
