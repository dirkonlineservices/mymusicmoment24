import React from "react";
import { SiPaypal, SiVisa } from "react-icons/si";
import { FaApplePay, FaGooglePay } from "react-icons/fa6";

export function PayPalBadge({ className = "h-4" }) {
  return (
    <div
      className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center gap-1.5 shadow-sm border border-slate-700/40 hover:scale-105 transition-transform"
      title="PayPal"
    >
      <SiPaypal className="text-[#003087] text-sm shrink-0" />
      <span className="font-extrabold text-xs tracking-tight text-[#003087] font-sans">
        Pay<span className="text-[#0079C1]">Pal</span>
      </span>
    </div>
  );
}

export function StripeBadge({ className = "h-4" }) {
  return (
    <div
      className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform"
      title="Stripe"
    >
      <span className="font-extrabold text-[13px] tracking-tight text-[#635BFF] lowercase font-sans">
        stripe
      </span>
    </div>
  );
}

export function VisaBadge({ className = "h-3.5" }) {
  return (
    <div
      className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform"
      title="Visa"
    >
      <SiVisa className="h-3.5 w-auto text-[#1A1F71]" />
    </div>
  );
}

export function MastercardBadge({ className = "h-4" }) {
  return (
    <div
      className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform"
      title="Mastercard"
    >
      <svg viewBox="0 0 36 24" className="h-4 w-auto" aria-label="Mastercard">
        <circle cx="12" cy="12" r="10" fill="#EB001B" />
        <circle cx="24" cy="12" r="10" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </div>
  );
}

export function ApplePayBadge({ className = "h-4" }) {
  return (
    <div
      className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform"
      title="Apple Pay"
    >
      <FaApplePay className="h-5 w-auto text-black" />
    </div>
  );
}

export function GooglePayBadge({ className = "h-4" }) {
  return (
    <div
      className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform"
      title="Google Pay"
    >
      <FaGooglePay className="h-5 w-auto text-slate-800" />
    </div>
  );
}

export function SepaBadge({ className = "h-4" }) {
  return (
    <div
      className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform"
      title="SEPA Überweisung / Lastschrift"
    >
      <span className="font-black tracking-wider text-[11px] text-[#003A70] font-sans">
        SEPA
      </span>
    </div>
  );
}

export function KlarnaBadge({ className = "h-4" }) {
  return (
    <div
      className="bg-[#FFB3C7] rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-pink-300 hover:scale-105 transition-transform"
      title="Klarna Sofort / Rechnung"
    >
      <span className="font-black tracking-tight text-[11px] text-slate-950 font-sans">
        Klarna.
      </span>
    </div>
  );
}

export default function PaymentBadges({ className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-2.5 ${className}`}>
      <PayPalBadge />
      <StripeBadge />
      <VisaBadge />
      <MastercardBadge />
      <ApplePayBadge />
      <GooglePayBadge />
      <SepaBadge />
      <KlarnaBadge />
    </div>
  );
}
