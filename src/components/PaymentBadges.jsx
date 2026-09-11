import React from "react";

export function PayPalBadge({ className = "h-4" }) {
  return (
    <div className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform" title="PayPal">
      <svg viewBox="0 0 100 24" className={`${className} w-auto`} aria-label="PayPal">
        <path fill="#003087" d="M12.2 2.2H4.4C3.8 2.2 3.3 2.6 3.2 3.2L0.2 21.8c-.1.4.2.8.6.8h4c.6 0 1-.4 1.1-1l.8-5.3c.1-.6.6-1 1.2-1h2.5c5.1 0 8.1-2.5 8.9-7.3.4-2.1.1-3.7-.9-4.7-1.1-1.1-3.1-1.4-5.2-1.4z" />
        <path fill="#0079C1" d="M13.6 7.6c-.4 2.5-2.2 4.1-5.3 4.1h-2l-.9 5.8c-.1.4.2.8.6.8h3.3c.5 0 1-.4 1.1-1l.7-4.4c.1-.6.6-1 1.2-1h1.5c4.1 0 6.6-2 7.2-5.9.3-1.7.1-3-.7-3.8-.3.7-.8 1.3-1.6 1.7-.8.5-1.9.7-3.2.7z" />
        <path fill="#00457C" d="M13.2 7.1c-.2 0-.4 0-.6.1-.8.5-1.9.7-3.2.7h-2.9l-1 6.5h2l.9-5.8h2c3.1 0 4.9-1.6 5.3-4.1.2-.9.1-1.6-.2-2.2-.6.7-1.4 1.1-2.3 1.2z" />
        {/* PayPal Text */}
        <path fill="#003087" d="M37.5 7.8h-4.7c-.4 0-.8.3-.8.7l-2.4 15.2c-.1.3.2.6.5.6h2.7c.4 0 .8-.3.8-.7l.7-4.4c.1-.4.4-.7.8-.7h1.6c3.4 0 5.4-1.6 5.9-4.8.3-1.4.1-2.4-.6-3.1-.7-.8-2-1.2-3.4-1.2zm.6 4.9c-.3 1.7-1.5 2.7-3.5 2.7h-1.3l.9-5.4h1.3c1.3 0 2.2.3 2.7.8.4.5.4 1.2.2 1.9z" />
        <path fill="#003087" d="M51.7 13.9c-.3-.4-.8-.7-1.5-.7-.8 0-1.7.4-2.2 1l-.1.8c-.1.3-.3.4-.6.4h-2.5c-.3 0-.5-.2-.5-.5l1.9-11.8c.1-.4.4-.7.8-.7h2.7c.3 0 .5.2.5.5l-.8 5.1c.7-.7 1.8-1.1 3-1.1 1.6 0 2.9.6 3.6 1.7.6.9.7 2.2.4 3.7-.4 2.6-1.7 4.5-3.3 5.4-1 .6-2.1.8-3.1.8-1.5 0-2.5-.6-2.8-1.5l-.6 3.6c-.1.3-.3.5-.6.5h-2.5c-.3 0-.5-.2-.5-.5l3.2-19.8c.1-.4.4-.7.8-.7h2.7c.3 0 .5.2.5.5l-.3 1.8c.8-.7 1.9-1.1 3.1-1.1 1.7 0 3.1.7 3.8 1.9.6 1.1.7 2.5.3 4.2-.4 2.8-1.8 5-3.5 6.1-1.1.7-2.3 1-3.6 1-1.6 0-2.7-.6-3.1-1.6zm2.3-3.6c.3-1.7-.5-2.7-2.1-2.7-1 0-1.9.6-2.4 1.4l-.7 4.2c.5.5 1.2.7 2 .7 1.6 0 2.9-1.4 3.2-3.6z" />
        <path fill="#0079C1" d="M68.5 7.8h-4.7c-.4 0-.8.3-.8.7l-2.4 15.2c-.1.3.2.6.5.6h2.8c.4 0 .8-.3.8-.7l.7-4.4c.1-.4.4-.7.8-.7h1.6c3.4 0 5.4-1.6 5.9-4.8.3-1.4.1-2.4-.6-3.1-.8-.8-2-1.2-3.4-1.2zm.6 4.9c-.3 1.7-1.5 2.7-3.5 2.7h-1.3l.9-5.4h1.3c1.3 0 2.2.3 2.7.8.4.5.4 1.2.2 1.9z" />
        <path fill="#0079C1" d="M78.6 13.5c-.1.6-.2 1.3-.2 1.9 0 1.2.3 2.1 1 2.6.6.5 1.5.7 2.5.7 1.4 0 2.5-.4 3.3-1.1.8-.7 1.3-1.7 1.6-2.9l.1-.8c.1-.4.4-.6.8-.6h2.5c.3 0 .6.3.5.6-.4 1.9-1.3 3.4-2.6 4.4-1.4 1.1-3.2 1.6-5.4 1.6-2.2 0-3.9-.6-5.1-1.8-1.1-1.2-1.6-2.8-1.3-4.9.4-2.6 1.7-4.7 3.5-5.9 1.4-.9 3.1-1.4 4.9-1.4 2.1 0 3.7.6 4.7 1.7.9 1.1 1.2 2.6.9 4.3-.1.4-.4.7-.8.7h-10.4zm7.3-3.1c-.2-.7-.6-1.3-1.3-1.7-.7-.4-1.5-.6-2.3-.6-1.3 0-2.4.5-3.1 1.4-.6.8-1 1.8-1.1 3h7.2c.4-.7.6-1.4.6-2.1z" />
        <path fill="#0079C1" d="M93.3 3.8l-2.4 15.2c-.1.3.2.6.5.6h2.6c.4 0 .8-.3.8-.7l2.4-15.1c.1-.4-.2-.7-.6-.7h-2.8c-.3 0-.5.3-.5.7z" />
      </svg>
    </div>
  );
}

export function StripeBadge({ className = "h-4" }) {
  return (
    <div className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform" title="Stripe">
      <svg viewBox="0 0 60 25" className={`${className} w-auto`} aria-label="Stripe">
        <path fill="#635BFF" d="M59.6 13.5c0-4.6-2.3-8.2-6.7-8.2s-7.1 3.6-7.1 8.2c0 5.4 3.2 8.1 7.7 8.1 2.2 0 3.9-.5 5.1-1.2v-3.7c-1.2.7-2.7 1.1-4.4 1.1-1.8 0-3.3-.7-3.5-2.8h9.7c.1-.5.2-1.1.2-1.5zm-8.8-1.8c0-2 .9-2.9 2.2-2.9 1.2 0 2.1.9 2.1 2.9h-4.3zm-11.2-6.4c-1.8 0-3 .8-3.7 1.5l-.2-1.2h-4.3v20.4l4.9-1 0-4.9c.7.6 1.8 1.3 3.4 1.3 3.5 0 6.6-2.8 6.6-8.1-.1-4.8-3.1-8-6.7-8zm-1.4 12.5c-1.2 0-2-.4-2.5-1v-6.9c.6-.7 1.4-1 2.5-1 1.9 0 3.4 1.7 3.4 4.5 0 2.7-1.4 4.4-3.4 4.4zm-14-11.4l-4.9 1.1v3.9h3.3v3.9h-3.3v5.8c0 1.2.8 1.6 1.9 1.6.6 0 1.2-.1 1.5-.2v3.7c-.5.2-1.4.4-2.6.4-3.2 0-5.7-1.4-5.7-5.4v-7.9h-2.3v-3.9h2.3l.5-4.1 4.7-1v5.1h4.6v-4.1zm-13.4 1.5c-1.5 0-2.8.6-3.5 1.5l-.2-1.2h-4.4v16.1h4.9v-10.7c0-2 1.3-3.1 2.9-3.1.5 0 1 .1 1.3.3v-4.5c-.3-.2-.8-.4-1-.4zm-14.7-.6c-3.7 0-6.1 1.9-6.1 5 0 4.9 6.7 4.1 6.7 6.3 0 .8-.7 1.2-1.8 1.2-1.5 0-3.4-.6-4.9-1.5l-1.3 3.8c1.6.9 3.8 1.4 6.1 1.4 3.9 0 6.8-1.9 6.8-5.1-.1-5.3-6.8-4.3-6.8-6.4 0-.7.6-1.1 1.6-1.1 1.3 0 2.9.5 4.1 1.2l1.3-3.7c-1.5-.7-3.4-1.1-5.7-1.1z" />
      </svg>
    </div>
  );
}

export function VisaBadge({ className = "h-3.5" }) {
  return (
    <div className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform" title="Visa">
      <svg viewBox="0 0 50 16" className={`${className} w-auto`} aria-label="Visa">
        <path fill="#1A1F71" d="M19.5 1.2l-3.2 13.4h-3.4L16.1 1.2h3.4zm14.1 8.7l1.8-4.9c-.1 0-.3-.1-.5-.1-1.3 0-2.3.7-2.4 1.7-.1.8.7 1.2 1.2 1.5.6.3.8.5.8.8 0 .4-.5.7-1 .7-.7 0-1.1-.1-1.7-.4l-.2-.1-.3 1.6c.5.2 1.3.4 2.2.4 2.1 0 3.5-1 3.5-2.6 0-2-.9-2.6-2-3.1-.7-.4-1.1-.6-1.1-1 0-.3.4-.7 1.2-.7.7 0 1.2.1 1.6.3l.2.1.3-1.6c-.4-.2-1.1-.3-1.9-.3-2 0-3.5 1.1-3.5 2.6 0 1.2.7 2.2 2.2 2.9.9.5 1.2.8 1.2 1.2 0 .5-.6.8-1.4.8-.8 0-1.4-.2-1.8-.4l-.3-.1-.3 1.6c.5.2 1.3.4 2.1.4 2.3 0 3.9-1.1 3.9-2.8zM42.2 1.2h-2.6c-.8 0-1.4.2-1.8 1.1L32.6 14.6h3.6l.7-2h4.4l.4 2h3.2L42.2 1.2zm-4.3 8.7l1.8-5 1 5h-2.8zm-26.6-8.7L7.9 10.3 7.5 8.4C6.9 6.2 5 3.9 2.8 2.7l3 11.9h3.6l5.3-13.4h-3.4zM4.6 1.2H.2l-.1.4c3.5.9 5.8 3.1 6.8 5.7L5.8 2c-.2-.7-.7-.8-1.2-.8z" />
      </svg>
    </div>
  );
}

export function MastercardBadge({ className = "h-4" }) {
  return (
    <div className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform" title="Mastercard">
      <svg viewBox="0 0 38 24" className={`${className} w-auto`} aria-label="Mastercard">
        <circle cx="12" cy="12" r="12" fill="#EB001B" />
        <circle cx="26" cy="12" r="12" fill="#F79E1B" />
        <path fill="#FF5F00" d="M19 3.5a11.95 11.95 0 0 0-4.6 8.5 11.95 11.95 0 0 0 4.6 8.5 11.95 11.95 0 0 0 4.6-8.5A11.95 11.95 0 0 0 19 3.5z" />
      </svg>
    </div>
  );
}

export function ApplePayBadge({ className = "h-4" }) {
  return (
    <div className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform" title="Apple Pay">
      <svg viewBox="0 0 54 24" className={`${className} w-auto`} aria-label="Apple Pay">
        {/* Apple Icon */}
        <path fill="#000" d="M11.5 8.4c-.6.7-1.6 1.3-2.6 1.2-.1-1.1.4-2.1 1-2.8.6-.7 1.7-1.3 2.5-1.3.1 1.1-.3 2.2-.9 2.9zm.9 1.4c-1.5-.1-2.7.9-3.4.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.1.8 1.1 1.7 2.3 2.9 2.2 1.1-.1 1.6-.7 2.9-.7s1.8.7 2.9.7c1.2 0 2-.1 2.8-1.2.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-.9-2.4-3.6 0-2.3 1.9-3.4 2-3.4-1.1-1.6-2.7-1.8-3.4-1.8z" />
        {/* Pay Text */}
        <path fill="#000" d="M24.8 6.4h4.1c2.8 0 4.6 1.8 4.6 4.4s-1.8 4.4-4.6 4.4h-2.1v5.3h-2v-14.1zm4 6.9c1.6 0 2.6-.9 2.6-2.5 0-1.5-1-2.5-2.6-2.5h-2v5h2zm7.6 7.3c-.2-.6-.3-1.3-.3-2 0-2.2 1.5-3.5 3.9-3.7l2.8-.2v-.7c0-1.2-.8-1.9-2.2-1.9-1.2 0-2.1.5-2.3 1.5h-1.8c.2-1.8 1.8-3.1 4.2-3.1 2.5 0 4 1.3 4 3.4v6.6h-1.8v-1.6c-.7 1.1-1.9 1.8-3.3 1.8-2 0-3.5-1-3.5-2.6zm6.7-2.3v-1.8l-2.5.2c-1.4.1-2.2.7-2.2 1.8 0 1 .8 1.6 1.9 1.6 1.6 0 2.8-.8 2.8-1.8zm5.5 5.8l2.9-8.4h2.1l-4.4 11.2c-.7 1.8-1.6 2.5-3.3 2.5-.5 0-1-.1-1.3-.2v-1.7c.3.1.7.1 1 .1.9 0 1.5-.4 1.9-1.5l1.1-2z" />
      </svg>
    </div>
  );
}

export function GooglePayBadge({ className = "h-4" }) {
  return (
    <div className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform" title="Google Pay">
      <svg viewBox="-4 0 58 24" className={`${className} w-auto`} aria-label="Google Pay">
        {/* Google G */}
        <path fill="#4285F4" d="M11.4 12.2c0-.7-.1-1.4-.2-2H4.6v3.8h3.8c-.2 1-.7 1.8-1.5 2.4v2h2.5c1.4-1.3 2.2-3.3 2.2-6.2z" />
        <path fill="#34A853" d="M4.6 19.1c2 0 3.7-.7 4.9-1.9l-2.5-2c-.7.5-1.5.7-2.4.7-1.9 0-3.5-1.3-4-3H-1.8v2.1c1.2 2.5 3.7 4.1 6.4 4.1z" />
        <path fill="#FBBC05" d="M.6 12.9c-.1-.5-.2-1.1-.2-1.7 0-.6.1-1.2.2-1.7V7.4H-1.8C-2.4 8.7-2.8 10.2-2.8 11.8s.4 3.1 1 4.4l2.4-1.9z" />
        <path fill="#EA4335" d="M4.6 4.7c1.1 0 2.1.4 2.9 1.1l2.2-2.2C8.3 2.3 6.6 1.5 4.6 1.5 1.9 1.5-.6 3.1-1.8 5.6L.6 7.7c.5-1.8 2.1-3 4-3z" />
        {/* Pay Text */}
        <path fill="#5F6368" d="M21.5 6.4h3.7c2.5 0 4.1 1.7 4.1 4.1s-1.6 4.1-4.1 4.1h-1.8v4.9h-1.9V6.4zm3.6 6.5c1.4 0 2.3-.9 2.3-2.4s-.9-2.4-2.3-2.4h-1.8v4.8h1.8zm6.9 6.8c-.2-.5-.3-1.2-.3-1.9 0-2.1 1.4-3.3 3.6-3.5l2.6-.2v-.7c0-1.1-.8-1.8-2.1-1.8-1.1 0-2 .5-2.2 1.4h-1.7c.2-1.7 1.7-2.9 3.9-2.9 2.3 0 3.7 1.2 3.7 3.2v6.2h-1.7v-1.5c-.6 1-1.8 1.7-3.1 1.7-1.9 0-3.3-.9-3.3-2.4zm6.2-2.2v-1.7l-2.3.2c-1.3.1-2 .7-2 1.7 0 1 .8 1.5 1.8 1.5 1.5 0 2.5-.8 2.5-1.7zm5.1 5.4l2.7-7.9h2l-4.1 10.5c-.7 1.7-1.5 2.3-3.1 2.3-.5 0-.9-.1-1.2-.2v-1.6c.3.1.6.1.9.1.8 0 1.4-.4 1.8-1.4l1-1.8z" />
      </svg>
    </div>
  );
}

export function SepaBadge({ className = "h-4" }) {
  return (
    <div className="bg-white rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-slate-700/40 hover:scale-105 transition-transform" title="SEPA Überweisung / Lastschrift">
      <span className="font-black tracking-wider text-[11px] text-[#003A70] font-sans">
        SEPA
      </span>
    </div>
  );
}

export function KlarnaBadge({ className = "h-4" }) {
  return (
    <div className="bg-[#FFB3C7] rounded-md px-2.5 py-1 h-7 flex items-center justify-center shadow-sm border border-pink-300 hover:scale-105 transition-transform" title="Klarna Sofort / Rechnung">
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
