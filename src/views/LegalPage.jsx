import React from "react";
import { ArrowLeft, ShieldCheck, Scale, FileText, Mail, MapPin, ExternalLink, Music, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

const PAGES = {
  impressum: {
    badge: "Rechtliche Anbieterkennzeichnung",
    title: "Impressum",
    intro: "Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 MStV.",
    tab: "Impressum (§ 5 DDG)",
  },
  datenschutz: {
    badge: "Datenschutz & Privatsphäre",
    title: "Datenschutzerklärung",
    intro: "Informationen über die Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO.",
    tab: "Datenschutzerklärung (DSGVO)",
  },
  agb: {
    badge: "Vertragsbedingungen",
    title: "Allgemeine Geschäftsbedingungen (AGB)",
    intro: "Allgemeine Geschäftsbedingungen für Bestellungen bei MyMusicMoment24.",
    tab: "AGB",
  },
  widerruf: {
    badge: "Verbraucherrechte",
    title: "Widerrufsbelehrung",
    intro: "Informationen zum Widerrufsrecht für Verbraucher.",
    tab: "Widerrufsbelehrung",
  },
};

const PAGES_EN = {
  impressum: {
    badge: "Provider identification",
    title: "Legal Notice",
    intro: "Information pursuant to § 5 of the German Digital Services Act (DDG) and § 18 (2) MStV.",
    tab: "Legal Notice",
  },
  datenschutz: {
    badge: "Data protection & privacy",
    title: "Privacy Policy",
    intro: "Information on the processing of your personal data under the GDPR.",
    tab: "Privacy Policy (GDPR)",
  },
  agb: {
    badge: "Contract terms",
    title: "Terms and Conditions",
    intro: "General terms and conditions for orders from MyMusicMoment24.",
    tab: "Terms (AGB)",
  },
  widerruf: {
    badge: "Consumer rights",
    title: "Right of Withdrawal",
    intro: "Information on the right of withdrawal for consumers.",
    tab: "Right of Withdrawal",
  },
};

const card = "bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50";

function TranslationNote() {
  return (
    <p className="text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
      This English version is a translation for your information. The German version is legally binding.
    </p>
  );
}

function ImprintEn() {
  return (
    <>
      <TranslationNote />
      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-600" /> Information pursuant to § 5 DDG (service provider)
        </h2>
        <div className="text-stone-700 space-y-1">
          <p className="font-bold text-stone-900 text-base">DS Online Services &amp; Digitalagentur SichtbarmitKI</p>
          <p className="font-medium text-stone-800">Owner: Dirk Schmetzer</p>
          <p>Riedgrasweg 30</p>
          <p>70599 Stuttgart, Germany</p>
          <p className="text-xs text-stone-500 pt-1">
            MyMusicMoment24 is a music and audio service of DS Online Services in connection with the digital agency SichtbarmitKI.
          </p>
        </div>
        <div className="pt-2 border-t border-stone-200 space-y-2">
          <h3 className="font-semibold text-stone-900 mb-1">Contact &amp; support:</h3>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Email (support &amp; service): </span>
            <a href="mailto:info@mymusicmoment24.de" className="text-amber-700 hover:underline font-medium">info@mymusicmoment24.de</a>
          </p>
          <p className="text-xs text-stone-500">For existing orders, support is also available via WhatsApp.</p>
        </div>
        <div className="pt-2 border-t border-stone-200">
          <h3 className="font-semibold text-stone-900 mb-1">VAT:</h3>
          <p>Small business owner under § 19 of the German VAT Act (UStG). No VAT is charged or shown.</p>
        </div>
        <div className="pt-3 border-t border-stone-200 space-y-2">
          <h3 className="font-semibold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" /> Digitalagentur SichtbarmitKI
          </h3>
          <p className="text-stone-700 text-xs sm:text-sm">
            Website &amp; portfolio:{" "}
            <a href="https://www.sichtbarmitki.agency" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline font-bold inline-flex items-center gap-1">
              <span>www.sichtbarmitki.agency</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
        <div className="pt-3 border-t border-stone-200">
          <h3 className="font-semibold text-stone-900 mb-1">Responsible for editorial content pursuant to § 18 (2) MStV:</h3>
          <p>Dirk Schmetzer, Riedgrasweg 30, 70599 Stuttgart, Germany</p>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" /> Consumer dispute resolution
        </h2>
        <p className="text-xs text-stone-500">
          We are neither obliged nor generally willing to take part in dispute resolution proceedings before a consumer arbitration board. We always try to resolve any disagreements directly and simply with our customers.
        </p>
      </section>

      <section className={`${card} text-xs text-stone-600`}>
        <h3 className="text-base font-bold text-stone-900">Liability for content</h3>
        <p>
          As a service provider, we are responsible for our own content on these pages under general law in accordance with § 7 (1) DDG. Under §§ 8 to 10 DDG, however, we are not obliged to monitor third-party information that is transmitted or stored, or to investigate circumstances that indicate illegal activity.
        </p>
        <h3 className="text-base font-bold text-stone-900 pt-2">Liability for links</h3>
        <p>
          Our website contains links to external third-party websites whose content we have no influence on. We therefore cannot accept any liability for this external content. The respective provider or operator of the linked pages is always responsible for their content.
        </p>
        <h3 className="text-base font-bold text-stone-900 pt-2">Copyright</h3>
        <p>
          The content, compositions and works created by the site operators on these pages are subject to German copyright law. Copying, editing, distributing and any kind of use beyond the limits of copyright law require the written consent of the respective author or creator.
        </p>
      </section>

      <section className={`${card} text-xs text-stone-600`}>
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-600" /> Technical indexes
        </h3>
        <div className="flex flex-wrap gap-3 pt-1">
          <a href="/sitemap.xml" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 transition">
            <span className="font-mono text-amber-700 text-[11px] font-bold">[XML]</span>
            <span>Sitemap (XML)</span>
          </a>
          <a href="/llms.txt" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 transition">
            <span className="font-mono text-blue-700 text-[11px] font-bold">[TXT]</span>
            <span>AI context document (llms.txt)</span>
          </a>
        </div>
      </section>
    </>
  );
}

function PrivacyEn() {
  const link = "text-emerald-700 underline font-medium";
  return (
    <>
      <TranslationNote />
      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> 1. Data protection at a glance
        </h2>
        <p>
          Protecting your personal data matters to us. Below we explain which data is collected, for what purpose, and which rights you have under the EU General Data Protection Regulation (GDPR).
        </p>
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
          <p className="font-semibold text-stone-900 mb-1">Controller:</p>
          <p>DS Online Services, Dirk Schmetzer</p>
          <p>Riedgrasweg 30</p>
          <p>70599 Stuttgart, Germany</p>
          <p className="mt-1">Email: <a href="mailto:info@mymusicmoment24.de" className={link}>info@mymusicmoment24.de</a></p>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">2. Data collected when you order a song &amp; use the configurator</h2>
        <p>When you order a personalized song through our configurator, we collect the following data:</p>
        <ul className="list-disc list-inside space-y-1 text-stone-700">
          <li>Names of the recipient and of the person placing the order</li>
          <li>Occasion (e.g. wedding, birthday, anniversary)</li>
          <li>Personal stories, anecdotes, character traits and music style preferences</li>
          <li>Email address and, if provided, phone / WhatsApp number for the digital delivery of the finished audio files (MP3/WAV)</li>
        </ul>
        <p className="text-xs text-stone-500">
          <strong>Legal basis:</strong> Art. 6 (1) (b) GDPR (performance of a contract or pre-contractual measures).
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">3. Payment service providers</h2>
        <p>To process payments, we use external payment service providers through whose platforms you can make payments:</p>
        <div className="space-y-3 text-xs text-stone-700">
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <p className="font-semibold text-stone-900 mb-1">PayPal</p>
            <p className="text-stone-600">
              PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg.
              Privacy policy: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className={link}>https://www.paypal.com/privacy</a>.
            </p>
          </div>
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <p className="font-semibold text-stone-900 mb-1">Credit cards, Apple Pay &amp; Google Pay (e.g. Stripe / Checkout)</p>
            <p className="text-stone-600">
              Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Ireland.
              Privacy policy: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className={link}>https://stripe.com/privacy</a>.
            </p>
          </div>
        </div>
        <p className="text-xs text-stone-500">
          <strong>Legal basis:</strong> Your payment data is passed on to the respective payment provider solely to process the contract and the payment, based on Art. 6 (1) (b) GDPR.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">4. Google Consent Mode v2 &amp; analytics</h2>
        <p>
          Our website uses <strong>Google Consent Mode v2</strong>. This means that all analytics and marketing cookies ("analytics_storage", "ad_storage") are disabled ("denied") by default.
        </p>
        <p>
          Measurement services are only activated once you explicitly agree in our cookie banner. You can change or withdraw your choice at any time via <em>"Cookie Preferences"</em> in the footer.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">5. Your rights as a data subject</h2>
        <p>Under the GDPR, you have the following rights at any time:</p>
        <ul className="list-disc list-inside space-y-1 text-stone-700">
          <li><strong>Right of access (Art. 15 GDPR):</strong> to the personal data we store about you.</li>
          <li><strong>Right to rectification (Art. 16 GDPR):</strong> if data is incorrect.</li>
          <li><strong>Right to erasure (Art. 17 GDPR):</strong> deletion of your data, unless legal retention obligations apply.</li>
          <li><strong>Restriction of processing (Art. 18 GDPR)</strong> and <strong>data portability (Art. 20 GDPR)</strong>.</li>
          <li><strong>Right to object (Art. 21 GDPR):</strong> to the processing of your data.</li>
        </ul>
        <p className="text-xs text-stone-500 mt-2">
          To exercise your rights, an informal email to <a href="mailto:info@mymusicmoment24.de" className={link}>info@mymusicmoment24.de</a> is enough.
        </p>
      </section>
    </>
  );
}

function TermsEn() {
  return (
    <>
      <TranslationNote />
      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" /> Section 1 Scope &amp; Provider
        </h2>
        <p>
          (1) These General Terms and Conditions (GTC) apply to all contracts for the creation and delivery of personalized songs, gift vouchers and related digital services concluded via the website <strong>mymusicmoment24.de</strong> between
        </p>
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs my-2">
          <p className="font-semibold text-stone-900">DS Online Services &amp; Digitalagentur SichtbarmitKI</p>
          <p>Owner: Dirk Schmetzer</p>
          <p>Riedgrasweg 30, 70599 Stuttgart, Germany</p>
          <p>Email: <a href="mailto:info@mymusicmoment24.de" className="text-amber-700 underline font-medium">info@mymusicmoment24.de</a></p>
        </div>
        <p>
          (hereinafter referred to as the &quot;Provider&quot;) and the customer (hereinafter referred to as the &quot;Customer&quot;).
        </p>
        <p>
          (2) Customers can be both consumers (Section 13 BGB) and entrepreneurs (Section 14 BGB). A consumer is any natural person who enters into a legal transaction for purposes that are predominantly neither commercial nor self-employed professional activities.
        </p>
        <p>
          (3) Any conflicting, deviating, or supplementary terms and conditions of the customer will not become part of the contract unless their validity is expressly agreed to in writing.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 2 Subject Matter &amp; Scope of Services</h2>
        <p>
          (1) Based on the details provided by the customer in the configurator or by message (such as names, occasion, personal stories, anecdotes, music genre, tempo, mood), the Provider creates individual, personalized musical pieces (hereinafter &quot;Song&quot; or &quot;Personalized Song&quot;).
        </p>
        <p>
          (2) <strong>Lyric Approval:</strong> Prior to final audio production and musical arrangement, the customer receives the drafted lyrics for review and approval. The customer can request adjustments to ensure names, milestones and story details are accurate.
        </p>
        <p>
          (3) Finished songs are delivered electronically as <strong>digital audio files</strong> (typically MP3 and/or WAV) via a secure download link, email or WhatsApp. No physical media (CDs, vinyl, USB drives) are shipped by default.
        </p>
        <p>
          (4) <strong>Optional Add-ons:</strong> Depending on the booking, the Provider offers options such as express 12h turnaround (on working days), a personalized PDF song certificate with lyrics and QR code, or digital release on major streaming platforms (Spotify, Apple Music, etc.) via music distributors. Platform guidelines and processing timelines apply to streaming releases.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 3 Conclusion of Contract</h2>
        <p>
          (1) The presentation of products on the website does not constitute a legally binding offer, but an invitation to place an order.
        </p>
        <p>
          (2) By completing the configurator, accepting the terms and clicking the payment button in checkout (e.g. via PayPal or credit card), the customer submits a binding offer to conclude a contract.
        </p>
        <p>
          (3) The contract is formed when the Provider accepts the customer&apos;s order by sending an email confirmation or begins production of the order.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 4 Customer Cooperation &amp; Third-Party Rights</h2>
        <p>
          (1) The customer is responsible for ensuring that all information provided (names, dates, stories) is accurate and complete.
        </p>
        <p>
          (2) The customer explicitly warrants that any submitted stories, lyrics, texts or images (e.g. for streaming cover art) do not infringe upon any third-party copyrights, trademark rights or personal rights, and comply with applicable law.
        </p>
        <p>
          (3) The Provider reserves the right to reject or cancel orders containing hate speech, discriminatory, defamatory or illegal content.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 5 Pricing, Payment &amp; Small Business Status</h2>
        <p>
          (1) Prices shown on the website at the time of the order apply.
        </p>
        <p>
          (2) <strong>Value Added Tax:</strong> In accordance with Section 19 of the German VAT Act (UStG) for small businesses, no VAT is charged or shown.
        </p>
        <p>
          (3) Payment is due in advance upon conclusion of the contract via the payment methods offered in checkout (PayPal, credit card, Apple Pay, Google Pay).
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 6 Delivery &amp; Turnaround Times</h2>
        <p>
          (1) Delivery takes place digitally without any shipping fees.
        </p>
        <p>
          (2) Standard production time is usually within 24 hours on working days following approval of the lyrics by the customer. If 12h express delivery was booked, delivery occurs within 12 hours on working days (for orders placed before 6:00 p.m.).
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 7 Rights of Use &amp; Copyright</h2>
        <p>
          (1) The created musical work is protected by copyright law.
        </p>
        <p>
          (2) <strong>Personal Use:</strong> Upon full payment, the Provider grants the customer a simple, perpetual, worldwide license to use the personalized song for <strong>private, non-commercial purposes</strong> (e.g. playing at private gatherings, weddings, birthdays, gifting to loved ones, and sharing on personal social media profiles).
        </p>
        <p>
          (3) <strong>Commercial Use (B2B):</strong> Any use for commercial, marketing, advertising or resale purposes requires a separate written agreement and commercial licensing.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 8 Right of Withdrawal</h2>
        <p>
          Consumers generally have a statutory right of withdrawal. However, pursuant to Section 312g (2) No. 1 BGB, the right of withdrawal <strong>does not apply</strong> to contracts for goods or digital services made to consumer specifications or clearly personalized (as is the case for personalized songs).
        </p>
        <p>
          Please see our detailed <a href="/en/withdrawal" className="text-amber-700 underline font-medium">Right of Withdrawal Policy</a> for full details and voucher exceptions.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 9 Warranty &amp; Artistic Discretion</h2>
        <p>
          (1) Statutory warranty rights apply.
        </p>
        <p>
          (2) <strong>Artistic Freedom:</strong> Music and vocal performance are creative works. The customer acknowledges that vocal timbre, musical arrangement and melodic styling within the chosen genre are subject to creative interpretation. Subjective personal taste does not constitute a defect as long as specifications were followed. Our lyric approval step ensures lyrics and facts are verified beforehand.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Section 10 Governing Law &amp; Dispute Resolution</h2>
        <p>
          (1) The laws of the Federal Republic of Germany apply, excluding the UN Convention on Contracts for the International Sale of Goods (CISG), subject to mandatory consumer protection regulations of the consumer&apos;s country of residence.
        </p>
        <p>
          (2) We are neither obligated nor generally willing to participate in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG).
        </p>
      </section>
    </>
  );
}

function WithdrawalEn() {
  return (
    <>
      <TranslationNote />
      <section className={card}>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 text-amber-950 space-y-2">
          <h3 className="font-bold text-base flex items-center gap-2 text-amber-900">
            <Scale className="w-5 h-5 text-amber-700" /> Important Notice Regarding Personalized Songs
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            Pursuant to <strong>Section 312g (2) No. 1 of the German Civil Code (BGB)</strong>, the statutory right of withdrawal <strong>does not apply</strong> to contracts for the supply of goods or digital works that are made to the consumer’s specifications or are <strong>clearly tailored to personal needs</strong>.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed">
            Because every song at MyMusicMoment24 is custom-composed and produced based on your personal stories, names, and occasions, <strong>no right of withdrawal exists</strong> once we have started personalized production following your lyric approval.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900 font-medium">
            For unredeemed gift vouchers, however, the standard 14-day statutory right of withdrawal applies as described below:
          </p>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" /> Statutory Right of Withdrawal
        </h2>
        <div className="space-y-4 text-stone-700">
          <div>
            <h3 className="font-bold text-stone-900 mb-1">Right of withdrawal</h3>
            <p>
              You have the right to withdraw from this contract within fourteen days without giving any reason (for example when purchasing unredeemed gift vouchers).
            </p>
            <p className="mt-2">
              The withdrawal period is fourteen days from the day of conclusion of the contract.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 mb-1">Exercising the right of withdrawal</h3>
            <p>To exercise your right of withdrawal, you must inform us:</p>
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs my-2">
              <p className="font-semibold text-stone-900">DS Online Services – Dirk Schmetzer</p>
              <p>Riedgrasweg 30, 70599 Stuttgart, Germany</p>
              <p>Email: <a href="mailto:info@mymusicmoment24.de" className="text-amber-700 underline font-medium">info@mymusicmoment24.de</a></p>
            </div>
            <p>
              of your decision to withdraw from this contract by means of an unequivocal statement (e.g. a letter sent by post or an email). You may use the attached model withdrawal form, but it is not mandatory.
            </p>
            <p className="mt-2 text-xs text-stone-500">
              To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 mb-1">Effects of withdrawal</h3>
            <p>
              If you withdraw from this contract, we will reimburse all payments received from you without undue delay and at the latest within fourteen days from the day on which we received notification of your withdrawal. We will use the same means of payment as you used for the initial transaction, unless expressly agreed otherwise; in no event will you be charged any fees for this reimbursement.
            </p>
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Early Expiry for Digital Services &amp; Content</h2>
        <p>
          In the case of contracts for the provision of services or digital content not supplied on a tangible medium, the right of withdrawal also expires prematurely if we have begun performance of the service after you have given your express consent and at the same time confirmed your knowledge that you lose your right of withdrawal upon full performance of the contract.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" /> Model Withdrawal Form
        </h2>
        <p className="text-xs text-stone-600">
          (If you wish to withdraw from the contract, you can copy, fill in and email this form:)
        </p>
        <div className="bg-stone-50 p-4 sm:p-6 rounded-xl border border-stone-200 text-xs font-mono text-stone-800 space-y-2 leading-relaxed">
          <p>To:</p>
          <p>DS Online Services – Dirk Schmetzer<br />Riedgrasweg 30, 70599 Stuttgart, Germany<br />Email: info@mymusicmoment24.de</p>
          <p className="pt-2">I/we (*) hereby give notice that I/we (*) withdraw from my/our (*) contract for the purchase of the following goods (*) / provision of the following service (*):</p>
          <p>__________________________________________________________________</p>
          <p>Ordered on (*) / received on (*): __________________________________</p>
          <p>Name of consumer(s): ___________________________________________</p>
          <p>Address of consumer(s): ________________________________________</p>
          <p>Signature of consumer(s) (only if notified on paper):</p>
          <p>__________________________________________________________________</p>
          <p>Date: ___________________________________________________________</p>
          <p className="text-[10px] text-stone-500 pt-2">(*) Delete as appropriate.</p>
        </div>
      </section>
    </>
  );
}

function TermsDe() {
  return (
    <>
      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" /> § 1 Geltungsbereich &amp; Anbieter
        </h2>
        <p>
          (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über die Erstellung und Lieferung personalisierter Musikstücke, Gutscheine und damit zusammenhängender digitaler Dienstleistungen, die über die Website <strong>mymusicmoment24.de</strong> zwischen der
        </p>
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs my-2">
          <p className="font-semibold text-stone-900">DS Online Services &amp; Digitalagentur SichtbarmitKI</p>
          <p>Inhaber: Dirk Schmetzer</p>
          <p>Riedgrasweg 30, 70599 Stuttgart, Deutschland</p>
          <p>E-Mail: <a href="mailto:info@mymusicmoment24.de" className="text-amber-700 underline font-medium">info@mymusicmoment24.de</a></p>
        </div>
        <p>
          (nachfolgend „Anbieter“ genannt) und dem Kunden (nachfolgend „Kunde“ genannt) geschlossen werden.
        </p>
        <p>
          (2) Kunde im Sinne dieser AGB können sowohl Verbraucher (§ 13 BGB) als auch Unternehmer (§ 14 BGB) sein. Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.
        </p>
        <p>
          (3) Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des Kunden werden nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 2 Leistungsgegenstand &amp; Leistungsumfang</h2>
        <p>
          (1) Der Anbieter erstellt auf Grundlage der vom Kunden im Konfigurator oder per Nachricht übermittelten individuellen Angaben (z. B. Namen, Anlass, persönliche Geschichten, Insider-Anekdoten, gewünschtes Musikgenre, Stimmung) individuelle, personalisierte Musikstücke (nachfolgend „Song“ oder „personalisierter Song“).
        </p>
        <p>
          (2) <strong>Textfreigabe (Lyrics-Abstimmung):</strong> Vor der finalen musikalischen Vertonung und Audioproduktion erhält der Kunde den entworfenen Liedtext zur Ansicht und Freigabe. Der Kunde kann hierbei Änderungswünsche einbringen, um sicherzustellen, dass Namen, Meilensteine und Fakten korrekt wiedergegeben werden.
        </p>
        <p>
          (3) Die Auslieferung des fertigen Musikstücks erfolgt als <strong>digitale Audiodatei</strong> (in der Regel im Format MP3 und/oder WAV) über einen sicheren Download-Link oder elektronisch per E-Mail bzw. WhatsApp. Ein Versand auf physischen Tonträgern (CD, Vinyl, USB-Stick) erfolgt standardmäßig nicht.
        </p>
        <p>
          (4) <strong>Optionale Zusatzleistungen:</strong> Der Anbieter bietet je nach Buchung zusätzliche Optionen an, wie z. B. Express-Fertigstellung (Lieferung innerhalb von 12 Stunden an Werktagen), eine offizielle Song-Urkunde mit Liedtext &amp; QR-Code als PDF oder die Veröffentlichung auf Streaming-Plattformen (Spotify, Apple Music, etc.) über externe Musikdistributoren. Bei Streaming-Releases gelten zusätzlich die Vorgaben und Bearbeitungszeiten der jeweiligen Plattformen.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 3 Vertragsschluss</h2>
        <p>
          (1) Die Präsentation der Produkte und Dienstleistungen auf der Website stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Bestellung dar.
        </p>
        <p>
          (2) Durch Durchlaufen des Konfigurators, Ausfüllen der erforderlichen Angaben, Akzeptieren der Vertragsbedingungen und Anklicken des abschließenden Zahlungs-Buttons im Checkout (z. B. via PayPal oder Kreditkarte) gibt der Kunde ein verbindliches Angebot zum Abschluss eines Vertrages ab.
        </p>
        <p>
          (3) Der Vertrag kommt zustande, sobald der Anbieter das Angebot des Kunden durch eine Bestellbestätigung per E-Mail annimmt oder unmittelbar mit der Ausführung des Auftrags beginnt.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 4 Mitwirkungspflichten des Kunden &amp; Rechte Dritter</h2>
        <p>
          (1) Der Kunde ist dafür verantwortlich, dass die von ihm im Konfigurator gemachten Angaben (insbesondere Namen, Daten, Sachverhalte und Botschaften) korrekt und vollständig sind.
        </p>
        <p>
          (2) Der Kunde versichert ausdrücklich, dass die von ihm übermittelten Informationen, Anekdoten, Texte oder eventuell beigestellten Materialien (z. B. Fotos für Streaming-Cover) frei von Rechten Dritter sind und insbesondere keine Urheber-, Marken- oder Persönlichkeitsrechte verletzen sowie nicht gegen geltendes Recht oder die guten Sitten verstoßen.
        </p>
        <p>
          (3) Der Anbieter behält sich vor, Aufträge abzulehnen oder zu stornieren, wenn der gewünschte Inhalt volksverhetzende, diskriminierende, beleidigende oder rechtswidrige Aussagen beinhaltet.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 5 Preise, Zahlungsbedingungen &amp; Kleinunternehmerstatus</h2>
        <p>
          (1) Es gelten die zum Zeitpunkt der Bestellung auf der Website ausgewiesenen Preise.
        </p>
        <p>
          (2) <strong>Hinweis zur Umsatzsteuer:</strong> Gemäß § 19 UStG (Besteuerung der Kleinunternehmer) wird keine Umsatzsteuer erhoben und folglich nicht gesondert ausgewiesen.
        </p>
        <p>
          (3) Dem Kunden stehen die im Checkout-Prozess angegebenen Zahlungsmethoden zur Verfügung (insbesondere PayPal, Kreditkarte, Debitkarte, Apple Pay, Google Pay). Die Vergütung ist mit Vertragsschluss im Voraus fällig.
        </p>
        <p>
          (4) Etwaige Aktions- oder Rabattcodes sind vor Abschluss des Bezahlvorgangs im dafür vorgesehenen Feld einzugeben. Ein nachträgliches Verrechnen nach Zahlungsabschluss ist nicht möglich.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 6 Bereitstellung &amp; Lieferfristen</h2>
        <p>
          (1) Die Bereitstellung der fertigen Musikstücke erfolgt digital. Es entstehen keine Versandkosten.
        </p>
        <p>
          (2) Die reguläre Produktionszeit beträgt in der Regel bis zu 24 Stunden an Werktagen ab erfolgreicher Freigabe des Liedtextes durch den Kunden. Bei gebuchter 12h-Express-Option erfolgt die Bereitstellung innerhalb von 12 Stunden an Werktagen (bei Bestellung vor 18:00 Uhr).
        </p>
        <p>
          (3) Verzögerungen, die auf einer verspäteten Mitwirkung oder Freigabe durch den Kunden beruhen, gehen nicht zu Lasten des Anbieters.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 7 Nutzungsrechte &amp; Urheberrecht</h2>
        <p>
          (1) Der erstellte Song unterliegt dem Schutz des Urheberrechtsgesetzes (UrhG).
        </p>
        <p>
          (2) <strong>Privater Gebrauch:</strong> Mit vollständiger Bezahlung der Vergütung räumt der Anbieter dem Kunden ein einfaches, zeitlich, räumlich und inhaltlich unbeschränktes Recht ein, den personalisierten Song für rein <strong>private, nicht-kommerzielle Zwecke</strong> zu nutzen. Dies umfasst insbesondere das Abspielen im Familien- und Freundeskreis, das Verschenken, die Aufführung auf privaten Veranstaltungen (z. B. Hochzeit, Geburtstag, Jubiläum) sowie das Teilen in persönlichen, nicht-kommerziellen Social-Media-Profilen.
        </p>
        <p>
          (3) <strong>Gewerbliche Nutzung (B2B):</strong> Eine Nutzung des Songs zu gewerblichen, werblichen oder kommerziellen Zwecken (z. B. als Image-Song, in Werbespots, in Podcasts mit Gewinnerzielungsabsicht, für den Weiterverkauf) ist nur nach ausdrücklicher, gesonderter schriftlicher Vereinbarung und individueller Lizenzierung gestattet.
        </p>
        <p>
          (4) Ein Weiterverkauf der Nutzungsrechte oder die Veräußerung des Musikwerks an unbefugte Dritte ist ohne vorherige schriftliche Zustimmung des Anbieters ausgeschlossen.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 8 Widerrufsrecht</h2>
        <p>
          Verbrauchern steht grundsätzlich ein gesetzliches Widerrufsrecht zu. Wir weisen jedoch ausdrücklich darauf hin, dass das Widerrufsrecht gemäß § 312g Abs. 2 Nr. 1 BGB <strong>nicht besteht</strong> bei Verträgen zur Lieferung von Waren oder digitalen Inhalten, die nach Kundenspezifikation angefertigt werden oder eindeutig auf die persönlichen Bedürfnisse zugeschnitten sind (wie es bei unseren personalisierten Songs der Fall ist).
        </p>
        <p>
          Ausführliche Informationen hierzu sowie zu den Ausnahmen (z. B. bei nicht eingelösten Geschenkgutscheinen) entnehmen Sie bitte unserer separaten <a href="/widerruf" className="text-amber-700 underline font-medium">Widerrufsbelehrung</a>.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 9 Gewährleistung &amp; Künstlerische Gestaltungsfreiheit</h2>
        <p>
          (1) Es gelten die gesetzlichen Gewährleistungsvorschriften.
        </p>
        <p>
          (2) <strong>Künstlerische Freiheit:</strong> Musik und Gesang sind Werke der schöpferischen Kunst. Dem Kunden ist bekannt, dass die akustische, gesangliche und musikalische Umsetzung innerhalb des vom Kunden gewählten Genres und Tempos der künstlerischen Interpretation unterliegt. Ein bloßes persönliches Nichtgefallen der Melodie, Stimmfarbe oder Instrumentierung bei ansonsten vertragsgemäßer Erstellung begründet keinen Mangel im rechtlichen Sinne. Durch die vorgeschaltete Textabstimmung (Lyrics-Approval) wird sichergestellt, dass inhaltliche Wünsche vor der endgültigen Vertonung abgestimmt sind.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">§ 10 Schlussbestimmungen &amp; Streitbeilegung</h2>
        <p>
          (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG), soweit dem keine zwingenden verbraucherschützenden Bestimmungen des Landes entgegenstehen, in dem der Kunde seinen gewöhnlichen Aufenthalt hat.
        </p>
        <p>
          (2) Streitbeilegung: Wir sind weder gesetzlich verpflichtet noch grundsätzlich bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
        </p>
        <p>
          (3) Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
        </p>
      </section>
    </>
  );
}

function WithdrawalDe() {
  return (
    <>
      <section className={card}>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 text-amber-950 space-y-2">
          <h3 className="font-bold text-base flex items-center gap-2 text-amber-900">
            <Scale className="w-5 h-5 text-amber-700" /> Wichtiger Vorabhinweis zum Widerrufsrecht bei personalisierten Songs
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            Gemäß <strong>§ 312g Abs. 2 Nr. 1 BGB</strong> besteht das gesetzliche Widerrufsrecht <strong>nicht</strong> bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die <strong>eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind</strong>.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed">
            Da jeder Song bei MyMusicMoment24 ein individuelles Einzelstück ist, das exakt nach deinen persönlichen Geschichten, Namen, Anlässen und Wünschen komponiert und produziert wird, <strong>erlischt bzw. besteht kein Widerrufsrecht</strong>, sobald wir nach deiner Textfreigabe mit der individuellen Musikproduktion begonnen haben.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900 font-medium">
            Für noch nicht eingelöste Wertgutscheine gilt hingegen das reguläre 14-tägige Widerrufsrecht nach folgender Belehrung:
          </p>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" /> Widerrufsbelehrung
        </h2>
        <div className="space-y-4 text-stone-700">
          <div>
            <h3 className="font-bold text-stone-900 mb-1">Widerrufsrecht</h3>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen (z. B. beim Erwerb von ungenutzten Geschenkgutscheinen).
            </p>
            <p className="mt-2">
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 mb-1">Ausübung des Widerrufs</h3>
            <p>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs my-2">
              <p className="font-semibold text-stone-900">DS Online Services – Dirk Schmetzer</p>
              <p>Riedgrasweg 30, 70599 Stuttgart, Deutschland</p>
              <p>E-Mail: <a href="mailto:info@mymusicmoment24.de" className="text-amber-700 underline font-medium">info@mymusicmoment24.de</a></p>
            </div>
            <p>
              mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            </p>
            <p className="mt-2 text-xs text-stone-500">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 mb-1">Folgen des Widerrufs</h3>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900">Vorzeitiges Erlöschen bei digitalen Dienstleistungen &amp; Inhalten</h2>
        <p>
          Bei Verträgen über die Erbringung von Dienstleistungen oder die Bereitstellung digitaler Inhalte erlischt das Widerrufsrecht auch dann vorzeitig, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben haben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren.
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" /> Muster-Widerrufsformular
        </h2>
        <p className="text-xs text-stone-600">
          (Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular kopieren, ausfüllen und per E-Mail an uns senden:)
        </p>
        <div className="bg-stone-50 p-4 sm:p-6 rounded-xl border border-stone-200 text-xs font-mono text-stone-800 space-y-2 leading-relaxed">
          <p>An:</p>
          <p>DS Online Services – Dirk Schmetzer<br />Riedgrasweg 30, 70599 Stuttgart, Deutschland<br />E-Mail: info@mymusicmoment24.de</p>
          <p className="pt-2">Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*) / die Erbringung der folgenden Dienstleistung (*):</p>
          <p>__________________________________________________________________</p>
          <p>Bestellt am (*) / erhalten am (*): __________________________________</p>
          <p>Name des/der Verbraucher(s): _____________________________________</p>
          <p>Anschrift des/der Verbraucher(s): __________________________________</p>
          <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
          <p>__________________________________________________________________</p>
          <p>Datum: ___________________________________________________________</p>
          <p className="text-[10px] text-stone-500 pt-2">(*) Unzutreffendes streichen.</p>
        </div>
      </section>
    </>
  );
}

export default function LegalPage({ type = "impressum", onBackToHome, onSwitchTab }) {
  const { language, lp } = useLanguage();
  const isEn = language === "en";
  const pages = isEn ? PAGES_EN : PAGES;
  const page = pages[type] || pages.impressum;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>{language === "en" ? "Back to Homepage" : "Zurück zur Startseite"}</span>
          </button>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-sm font-bold text-stone-900 hover:opacity-90 transition"
            >
              <img
                src="/images/logo-icon.png"
                alt="MyMusicMoment24 Logo"
                className="w-7 h-7 object-contain"
              />
              <span className="hidden sm:inline">MyMusicMoment<span className="text-amber-500">24</span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-amber-50/50 via-white to-[#faf8f5] border-b border-stone-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-4">
            {type === "datenschutz" ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Scale className="w-3.5 h-3.5 text-amber-600" />}
            {page.badge}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            {page.title}
          </h1>
          <p className="text-stone-600 text-sm md:text-base max-w-xl mx-auto">
            {page.intro}
          </p>

          {/* Quick Switch Tabs (echte Links, damit Google sie findet) */}
          <nav aria-label={isEn ? "Legal pages" : "Rechtliche Seiten"} className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6">
            {Object.entries(pages).map(([key, item]) => (
              <a
                key={key}
                href={lp(`/${key}`)}
                aria-current={type === key ? "page" : undefined}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onSwitchTab(key);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  type === key
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-white text-stone-600 hover:text-stone-900 border border-stone-200"
                }`}
              >
                {item.tab}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Legal Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 text-stone-700 text-sm leading-relaxed space-y-8">
        {isEn && type === "impressum" && <ImprintEn />}
        {isEn && type === "datenschutz" && <PrivacyEn />}
        {isEn && type === "agb" && <TermsEn />}
        {isEn && type === "widerruf" && <WithdrawalEn />}

        {!isEn && type === "agb" && <TermsDe />}
        {!isEn && type === "widerruf" && <WithdrawalDe />}

        {!isEn && type === "impressum" && (
          <>
            {/* Anbieterkennzeichnung */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" /> Angaben gemäß § 5 DDG (Diensteanbieter)
              </h2>
              <div className="text-stone-700 space-y-1">
                <p className="font-bold text-stone-900 text-base">DS Online Services &amp; Digitalagentur SichtbarmitKI</p>
                <p className="font-medium text-stone-800">Inhaber: Dirk Schmetzer</p>
                <p>Riedgrasweg 30</p>
                <p>70599 Stuttgart, Deutschland</p>
                <p className="text-xs text-stone-500 pt-1">
                  MyMusicMoment24 ist ein spezialisierter Musik- &amp; Audio-Service von DS Online Services in Verbindung mit der Digitalagentur SichtbarmitKI.
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-2">
                <h3 className="font-semibold text-stone-900 mb-1">Kontakt &amp; Support:</h3>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>E-Mail (Support &amp; Service): </span>
                  <a href="mailto:info@mymusicmoment24.de" className="text-amber-700 hover:underline font-medium">
                    info@mymusicmoment24.de
                  </a>
                </p>
                <p className="text-xs text-stone-500">
                  Support auch direkt über WhatsApp für bestehende Bestellungen erreichbar.
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <h3 className="font-semibold text-stone-900 mb-1">Umsatzsteuer:</h3>
                <p>Kleinunternehmer gemäß § 19 UStG, daher wird keine Umsatzsteuer berechnet und ausgewiesen.</p>
              </div>

              {/* Digitalagentur SichtbarmitKI */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Digitalagentur SichtbarmitKI
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm">
                  Webseite &amp; Portfolio:{" "}
                  <a
                    href="https://www.sichtbarmitki.agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>www.sichtbarmitki.agency</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Die <strong>Digitalagentur SichtbarmitKI</strong> (DS Online Services) ist spezialisiert auf modernste KI-Workflows, automatisierte Content-Erstellung, Webentwicklung und Audio-Branding im Großraum Stuttgart und im gesamten DACH-Raum.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <h3 className="font-semibold text-stone-900 mb-1">Verantwortlich für redaktionelle Inhalte gemäß § 18 Abs. 2 MStV:</h3>
                <p>Dirk Schmetzer, Riedgrasweg 30, 70599 Stuttgart, Deutschland</p>
              </div>
            </section>

            {/* Verbraucherstreitbeilegung (EU-OS-Plattform am 20.07.2025 eingestellt) */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" /> Verbraucherstreitbeilegung
              </h2>
              <p className="text-xs text-stone-500">
                Wir sind nicht verpflichtet und grundsätzlich nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Wir bemühen uns stets, eventuelle Unstimmigkeiten direkt und unbürokratisch mit unseren Kunden zu lösen.
              </p>
            </section>

            {/* Haftung & Urheberrecht */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 text-xs text-stone-600 shadow-md shadow-stone-200/50">
              <h3 className="text-base font-bold text-stone-900">Haftung für Inhalte</h3>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>

              <h3 className="text-base font-bold text-stone-900 pt-2">Urheberrecht</h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte, Kompositionen und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>

            {/* Technische Indizes & Transparenzangaben */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 text-xs text-stone-600 shadow-md shadow-stone-200/50">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" /> Technische Indizes &amp; Transparenzangaben
              </h3>
              <p>
                Zur Gewährleistung von Transparenz nach modernen Webstandards und zur Unterstützung automatisierter Indexierungen stellen wir folgende maschinenlesbare Index- und Kontextdaten bereit:
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 transition"
                >
                  <span className="font-mono text-amber-700 text-[11px] font-bold">[XML]</span>
                  <span>Sitemap (XML)</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
                <a
                  href="/llms.txt"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 transition"
                >
                  <span className="font-mono text-blue-700 text-[11px] font-bold">[TXT]</span>
                  <span>KI-Kontextdokument (llms.txt)</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </div>
            </section>
          </>
        )}

        {!isEn && type === "datenschutz" && (
          <>
            {/* Datenschutzerklärung */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> 1. Datenschutz auf einen Blick
              </h2>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Nachfolgend informieren wir Sie darüber, welche Daten erhoben werden, zu welchem Zweck dies geschieht und welche Rechte Sie nach der europäischen Datenschutz-Grundverordnung (DSGVO) haben.
              </p>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                <p className="font-semibold text-stone-900 mb-1">Verantwortliche Stelle:</p>
                <p>DS Online Services – Dirk Schmetzer</p>
                <p>Riedgrasweg 30</p>
                <p>70599 Stuttgart, Deutschland</p>
                <p className="mt-1">E-Mail: <a href="mailto:info@mymusicmoment24.de" className="text-emerald-700 underline font-medium">info@mymusicmoment24.de</a></p>
              </div>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900">2. Datenerfassung bei Song-Bestellung &amp; Konfigurator</h2>
              <p>
                Wenn Sie über unseren Konfigurator einen personalisierten Song beauftragen, erheben wir folgende Daten:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-700">
                <li>Namen der beschenkten Person und des Auftraggebers</li>
                <li>Anlass (z. B. Hochzeit, Geburtstag, Jubiläum)</li>
                <li>Persönliche Geschichten, Anekdoten, Charaktereigenschaften und Musikstil-Präferenzen</li>
                <li>E-Mail-Adresse und ggf. Telefonnummer / WhatsApp-Nummer für die digitale Zustellung der fertigen Audio-Dateien (MP3/WAV)</li>
              </ul>
              <p className="text-xs text-stone-500">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Erfüllung eines Vertrages bzw. Durchführung vorvertraglicher Maßnahmen).
              </p>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900">3. Zahlungsdienstleister &amp; Zahlungsabwicklung</h2>
              <p>
                Zur Abwicklung von Zahlungen setzen wir externe Zahlungsdienstleister ein, über deren Plattformen Sie Zahlungen vornehmen können:
              </p>
              <div className="space-y-3 text-xs text-stone-700">
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <p className="font-semibold text-stone-900 mb-1">PayPal</p>
                  <p className="text-stone-600">
                    PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg.
                    Datenschutzerklärung: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-medium">https://www.paypal.com/privacy</a>.
                  </p>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <p className="font-semibold text-stone-900 mb-1">Kreditkarten, Apple Pay &amp; Google Pay (z. B. Stripe / Checkout)</p>
                  <p className="text-stone-600">
                    Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland.
                    Datenschutzerklärung: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-medium">https://stripe.com/privacy</a>.
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-500">
                <strong>Rechtsgrundlage:</strong> Die Weitergabe Ihrer Zahlungsdaten an den jeweiligen Zahlungsanbieter erfolgt ausschließlich zur Vertragsabwicklung und Zahlungsdurchführung auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900">4. Google Consent Mode v2 &amp; Analyse</h2>
              <p>
                Unsere Website nutzt den offiziellen <strong>Google Consent Mode v2</strong>. Das bedeutet: Standardmäßig sind alle Analyse- und Marketing-Cookies ("analytics_storage", "ad_storage") deaktiviert ("denied").
              </p>
              <p>
                Erst wenn Sie über unseren Cookie-Banner explizit zustimmen, werden entsprechende Messdienste aktiviert. Sie können Ihre Auswahl jederzeit im Footer über den Link <em>"Cookie-Einstellungen"</em> anpassen oder widerrufen.
              </p>
            </section>

            <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-stone-200/50">
              <h2 className="text-xl font-bold text-stone-900">5. Ihre Rechte als betroffene Person</h2>
              <p>
                Sie haben nach der DSGVO jederzeit folgende Rechte:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-700">
                <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Über Ihre bei uns gespeicherten personenbezogenen Daten.</li>
                <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Bei unrichtigen Daten.</li>
                <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Löschung Ihrer Daten, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
                <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO)</strong> sowie <strong>Datenübertragbarkeit (Art. 20 DSGVO)</strong>.</li>
                <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Gegen die Verarbeitung Ihrer Daten.</li>
              </ul>
              <p className="text-xs text-stone-500 mt-2">
                Zur Wahrnehmung Ihrer Rechte genügt eine formlose E-Mail an <a href="mailto:info@mymusicmoment24.de" className="text-emerald-700 underline font-medium">info@mymusicmoment24.de</a>.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
