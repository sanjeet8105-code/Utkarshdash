"use client";

import { useMemo, useState } from "react";
import {
  ShieldCheck,
  PiggyBank,
  TrendingUp,
  Globe2,
  Home as HomeIcon,
  Briefcase,
  GraduationCap,
  Coins,
  Car,
  Rocket,
  Handshake,
  Tag,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Star,
  User,
  BarChart3,
  Calculator,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content — edit these arrays to change what the page displays       */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Loans", href: "#loans" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const LOAN_OPTIONS = [
  {
    icon: PiggyBank,
    title: "Personal Loan",
    rate: "10.49% onwards",
    desc: "Quick access to funds for your personal needs with minimal documentation.",
  },
  {
    icon: HomeIcon,
    title: "Home Loan",
    rate: "8.75% onwards",
    desc: "Turn your dream of owning a home into reality with our flexible home loan options.",
  },
  {
    icon: Briefcase,
    title: "Business Loan",
    rate: "11.25% onwards",
    desc: "Power your business growth with tailored financing built for entrepreneurs.",
  },
  {
    icon: GraduationCap,
    title: "Education Loan",
    rate: "8.75% onwards",
    desc: "Make education affordable with our easy and flexible student loan plans.",
  },
  {
    icon: Coins,
    title: "Gold Loan",
    rate: "10.25% onwards",
    desc: "Unlock your gold's potential — get a quick loan to achieve your goals today.",
  },
  {
    icon: Car,
    title: "Car Loan",
    rate: "10.49% onwards",
    desc: "Drive your dream car home with our low-interest car loan options.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Transparent Process",
    desc: "Clear documentation and upfront information about all terms and conditions.",
  },
  {
    icon: Rocket,
    title: "Fast Approvals",
    desc: "Get your loan approved within 24 hours through our streamlined process.",
  },
  {
    icon: Handshake,
    title: "Trusted Lenders",
    desc: "Partner with India's top banks and NBFCs for secure lending.",
  },
  {
    icon: Tag,
    title: "No Hidden Fees",
    desc: "All charges clearly disclosed upfront with no surprise costs.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    desc: "Round-the-clock assistance for all your loan-related queries.",
  },
];

const CHARGES = [
  {
    title: "Interest Rate",
    desc: "Starting interest rate varies based on credit history, financial obligations, and lender discretion.",
  },
  {
    title: "Eligibility",
    desc: "Loan approval is subject to successful KYC and income verification.",
  },
  {
    title: "APR & Repayment Schedule",
    desc: "Min APR – 5.99%, Max APR – 18%. Repayment tenure: 6 to 120 months. T&C apply.",
  },
  {
    title: "Processing / Facilitation Fee",
    desc: "Ranges from 2% to 5% of the approved loan.",
  },
  {
    title: "Foreclosure Policy",
    desc: "No part payments. Full payment allowed only after paying at least 3 EMIs.",
  },
  {
    title: "Overdue EMI Charges",
    desc: "2% per month on outstanding amount.",
  },
  {
    title: "Cheque Bounce",
    desc: "₹500 per bounce.",
  },
  {
    title: "Loan Cancellation",
    desc: "No extra charges. Interest between disbursement and cancellation is payable. Processing fees are non-refundable.",
  },
  {
    title: "Example",
    desc: "Loan of ₹1L at 8% p.a. for 24 months = EMI of ₹4,523.",
  },
];

const FAQS = [
  {
    q: "What documents do I need to apply for a loan?",
    a: "You'll typically need a valid ID proof, address proof, income proof (salary slips or ITR), and bank statements from the last three months. Specific document lists vary by loan type.",
  },
  {
    q: "How long does the loan approval process take?",
    a: "Most applications are reviewed within 24 hours of submitting complete documentation. Disbursal timelines depend on the lender and loan type.",
  },
  {
    q: "What is the minimum credit score required for loan approval?",
    a: "A CIBIL score of 700 or above generally improves your chances, though eligibility also depends on income, existing obligations, and the lending partner's policy.",
  },
  {
    q: "Can I repay my loan before the tenure ends?",
    a: "Foreclosure is allowed only after at least 3 EMIs have been paid, and part payments are not permitted. See our charges section for details.",
  },
  {
    q: "How are interest rates determined for my loan?",
    a: "Rates are set based on your credit profile, income stability, loan amount, tenure, and the specific lending partner's risk assessment.",
  },
  {
    q: "Is there a processing fee for loan applications?",
    a: "Yes, a facilitation fee of 2% to 5% of the approved loan amount applies and is non-refundable, even if the loan is later cancelled.",
  },
];

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs sm:text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-ink">
          {suffix === "₹" ? formatINR(value) : `${value}${suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-brand/15 accent-[#4F3FF0]"
      />
    </div>
  );
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white transition-colors ${
        open ? "border-brand/30" : "border-black/5"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
      >
        <Star
          className={`h-4 w-4 shrink-0 ${open ? "fill-brand text-brand" : "text-brand/40"}`}
        />
        <span className="flex-1 text-sm font-semibold text-ink sm:text-base">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-brand transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pl-14 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6 sm:pl-16">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [amount, setAmount] = useState(2500000);
  const [tenure, setTenure] = useState(31);
  const [rate, setRate] = useState(12.4);

  const { emi, interest, total } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const monthly =
      r === 0 ? amount / n : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = monthly * n;
    return {
      emi: Math.round(monthly),
      interest: Math.round(totalPayable - amount),
      total: Math.round(totalPayable),
    };
  }, [amount, tenure, rate]);

  const principalShare = amount / total;
  const circumference = 2 * Math.PI * 70;
  const principalDash = circumference * principalShare;

  return (
    <main className="bg-white font-sans text-ink antialiased">
      {/* ---------------------------------------------------------- */}
      {/* Header                                                     */}
      {/* ---------------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <a href="#home" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-extrabold text-white">
              U
            </span>
            <span className="text-base font-bold tracking-tight text-ink sm:text-lg">
              Utkarsh Capital
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ink/70 transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#contact"
              className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-brand hover:text-brand"
            >
              <User className="h-4 w-4" /> Login
            </a>
          </div>

          <button
            className="text-ink md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-black/5 bg-white px-4 pb-5 sm:px-6 md:hidden">
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink/80 hover:bg-brand/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ---------------------------------------------------------- */}
      {/* Hero                                                        */}
      {/* ---------------------------------------------------------- */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-brand-deep via-[#2E2494] to-brand"
      >
        {/* decorative glow + floating icon chips, not a stock photo */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute right-6 top-24 hidden flex-col gap-4 sm:right-10 md:flex">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Calculator className="h-6 w-6 text-white/80" strokeWidth={1.5} />
          </div>
          <div className="ml-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <BarChart3 className="h-6 w-6 text-white/80" strokeWidth={1.5} />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <TrendingUp className="h-6 w-6 text-white/80" strokeWidth={1.5} />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:py-28">
          <div className="max-w-2xl text-center sm:text-left">
            <h1 className="text-[2.25rem] font-extrabold leading-[1.15] text-white sm:text-5xl md:text-[3.4rem]">
              Unlock Your Financial Freedom
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/75 sm:mx-0 sm:text-base">
              Simple, secure, and smart personal loans. Tailored for your
              journey — with flexible EMIs and trusted support.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:mx-0 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3.5 shadow-lg shadow-black/10">
                <Phone className="h-4 w-4 text-brand/60" />
                <span className="text-sm text-ink/50">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <label className="mx-auto mt-4 flex w-fit items-center gap-2 text-xs text-white/60 sm:mx-0">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-3.5 w-3.5 accent-white"
              />
              I agree to the{" "}
              <a href="#" className="underline underline-offset-2">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-2">
                Privacy Policy
              </a>
            </label>

            <div className="mx-auto mt-10 flex max-w-md flex-wrap justify-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-xs text-white/70 sm:mx-0 sm:justify-start">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-white" /> Trusted
              </span>
              <span className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-white" /> Savings
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-white" /> Growth
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Who we are                                                  */}
      {/* ---------------------------------------------------------- */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
          <div className="relative order-2 md:order-1">
            <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-brand-light">
              <div className="grid grid-cols-2 gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md shadow-brand/10 sm:h-24 sm:w-24">
                  <Globe2 className="h-10 w-10 text-brand" strokeWidth={1.5} />
                </div>
                <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md shadow-brand/10 sm:h-24 sm:w-24">
                  <BarChart3 className="h-10 w-10 text-brand" strokeWidth={1.5} />
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md shadow-brand/10 sm:h-24 sm:w-24">
                  <Calculator className="h-10 w-10 text-brand" strokeWidth={1.5} />
                </div>
                <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md shadow-brand/10 sm:h-24 sm:w-24">
                  <TrendingUp className="h-10 w-10 text-brand" strokeWidth={1.5} />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-xl shadow-brand/10 sm:left-6 sm:translate-x-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                <ShieldCheck className="h-5 w-5 text-brand" />
              </span>
              <div className="text-sm">
                <p className="font-semibold text-ink">Finance with Trust</p>
                <p className="text-xs text-muted">RBI-recognized NBFC partner</p>
              </div>
            </div>
          </div>

          <div className="order-1 text-center md:order-2 md:text-left">
            <span className="inline-block rounded-full bg-brand-light px-4 py-1.5 text-xs font-semibold text-brand">
              Who We Are
            </span>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink sm:text-3xl md:text-4xl">
              Simple, Secure &amp; Built for Growth
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base md:mx-0">
              We&apos;re not just another credit platform. We&apos;re your
              growth partner — helping you save smarter, borrow with
              confidence, and build wealth step by step.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-6 text-sm md:justify-start">
              <span className="flex items-center gap-2 font-medium text-ink/80">
                <ShieldCheck className="h-4 w-4 text-brand" /> Trusted
              </span>
              <span className="flex items-center gap-2 font-medium text-ink/80">
                <PiggyBank className="h-4 w-4 text-brand" /> Smart
              </span>
              <span className="flex items-center gap-2 font-medium text-ink/80">
                <TrendingUp className="h-4 w-4 text-brand" /> Growth
              </span>
            </div>

            <a
              href="#about"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              Explore Our Story <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Loan options                                                */}
      {/* ---------------------------------------------------------- */}
      <section id="loans" className="bg-[#FAFAFE] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl md:text-4xl">
              Explore Our Loan Options
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              <span className="font-semibold text-brand">Utkarsh Capital</span>{" "}
              strictly practices robust, responsible lending. From personal
              needs to big dreams — choose the right loan with flexible plans
              and competitive rates.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {LOAN_OPTIONS.map((loan) => {
              const Icon = loan.icon;
              return (
                <div
                  key={loan.title}
                  className="group relative rounded-2xl border border-black/5 bg-white p-6 shadow-sm shadow-black/[0.03] transition-shadow hover:shadow-lg hover:shadow-brand/10"
                >
                  <span className="absolute right-5 top-5 whitespace-nowrap rounded-full bg-navy px-3 py-1 text-[11px] font-semibold text-white">
                    {loan.rate}
                  </span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{loan.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {loan.desc}
                  </p>
                  <a
                    href="#contact"
                    className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    Apply Now
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Why choose us                                               */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl md:text-4xl">
            Why <span className="text-brand">Choose Us</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted sm:text-base">
            Discover how we make financing simple, transparent, and truly
            built around you.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-5 sm:mt-16">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const fromRight = i % 2 === 1;
            return (
              <div
                key={f.title}
                className={`relative flex items-center gap-4 sm:w-[85%] md:w-1/2 ${
                  fromRight ? "sm:ml-auto sm:flex-row-reverse" : ""
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/5 bg-white text-brand shadow-md shadow-brand/10 sm:h-14 sm:w-14">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                </span>
                <div
                  className={`flex-1 rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-sm shadow-black/[0.02] sm:px-6 sm:py-5 ${
                    fromRight ? "sm:-mr-7 sm:text-right" : "sm:-ml-7"
                  }`}
                >
                  <h3 className="text-sm font-bold text-ink sm:text-base">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex items-center justify-center gap-3 rounded-2xl bg-brand-light px-6 py-5 text-center">
          <Users className="h-5 w-5 text-brand" />
          <p className="text-sm text-ink">
            Over <span className="font-bold text-brand">12,000+</span>{" "}
            businesses growing with us
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* EMI calculator                                              */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-[#EFEDFC] py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-medium text-muted">Your Monthly EMI</p>
            <p className="mt-2 text-4xl font-extrabold text-brand sm:text-5xl">
              {formatINR(emi)}
            </p>
          </div>

          <div className="mt-10 grid gap-8 rounded-3xl bg-white p-6 shadow-xl shadow-brand/10 sm:mt-12 sm:p-8 md:grid-cols-[220px_1fr] md:p-10">
            <div className="mx-auto flex flex-col items-center justify-center">
              <svg viewBox="0 0 180 180" className="h-40 w-40 -rotate-90 sm:h-44 sm:w-44">
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke="#EFEDFC"
                  strokeWidth="16"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke="#4F3FF0"
                  strokeWidth="16"
                  strokeDasharray={`${principalDash} ${circumference}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="mt-4 flex gap-5 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand" /> Principal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-brand-light" /> Interest
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-xl bg-[#FAFAFE] px-3 py-3 sm:px-4">
                  <p className="text-[10px] text-muted sm:text-[11px]">Principal</p>
                  <p className="mt-1 text-xs font-bold text-ink sm:text-sm">
                    {formatINR(amount)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#FAFAFE] px-3 py-3 sm:px-4">
                  <p className="text-[10px] text-muted sm:text-[11px]">Interest</p>
                  <p className="mt-1 text-xs font-bold text-ink sm:text-sm">
                    {formatINR(interest)}
                  </p>
                </div>
                <div className="rounded-xl bg-brand-light px-3 py-3 sm:px-4">
                  <p className="text-[10px] text-brand sm:text-[11px]">
                    Total Payable
                  </p>
                  <p className="mt-1 text-xs font-bold text-brand sm:text-sm">
                    {formatINR(total)}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <Slider
                  label="Loan Amount"
                  value={amount}
                  min={50000}
                  max={5000000}
                  step={10000}
                  suffix="₹"
                  onChange={setAmount}
                />
                <Slider
                  label="Tenure"
                  value={tenure}
                  min={3}
                  max={84}
                  step={1}
                  suffix=" Months"
                  onChange={setTenure}
                />
                <Slider
                  label="Interest Rate"
                  value={rate}
                  min={6}
                  max={24}
                  step={0.1}
                  suffix="%"
                  onChange={setRate}
                />
              </div>

              <a
                href="#contact"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:w-fit sm:px-8"
              >
                Apply for This Loan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Rates & charges                                             */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl md:text-4xl">
            Loan Interest Rates &amp; <span className="text-brand">Charges</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted sm:text-base">
            Every fee and policy laid out transparently — because at{" "}
            <span className="font-semibold text-ink">Utkarsh Capital</span>,
            we believe clarity is the first step to trust.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:mt-14">
          {CHARGES.map((c, i) => (
            <div
              key={c.title}
              className="relative rounded-2xl border border-black/5 bg-white py-4 pl-14 pr-5 shadow-sm shadow-black/[0.02] sm:py-5 sm:pl-16 sm:pr-6"
            >
              <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white sm:left-5 sm:top-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-bold text-ink sm:text-base">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 rounded-2xl bg-brand-light px-6 py-4 text-center text-xs text-brand sm:text-sm">
          Rates &amp; charges are indicative and depend on credit profile and
          lender approval.
        </p>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* FAQ                                                         */}
      {/* ---------------------------------------------------------- */}
      <section id="faq" className="bg-[#FAFAFE] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-sm text-muted sm:text-base">
              Get quick answers to the most common queries about{" "}
              <span className="font-semibold text-brand">Utkarsh Capital</span>{" "}
              loans.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:mt-12">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            Can&apos;t find your answer?{" "}
            <a href="#contact" className="font-semibold text-brand underline underline-offset-2">
              Contact support
            </a>{" "}
            — we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Grievance redressal                                         */}
      {/* ---------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-8 rounded-3xl bg-brand-light p-6 md:grid-cols-2 md:items-center md:gap-12 md:p-12">
          <div>
            <h2 className="text-xl font-extrabold text-ink sm:text-2xl md:text-3xl">
              Grievance Redressal
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              At <span className="font-semibold text-ink">Utkarsh Capital</span>,
              we strictly adhere to RBI directives and have established a
              robust Grievance Redressal Cell to address all concerns
              promptly. We are committed to responsible lending, ensuring
              that our loan offerings are convenient to repay. Our recovery
              methods are ethical, and we never resort to coercive tactics;
              if you have any complaints, we take them seriously and strive
              to resolve all issues within 5 working days.
            </p>
            <p className="mt-4 text-xs text-muted sm:text-sm">
              We are proudly registered as{" "}
              <span className="font-semibold text-ink">
                Uni-Corn Fincorp Private Limited
              </span>
              , a Non-Banking Financial Company (NBFC) recognized and
              approved by the Reserve Bank of India (RBI).
            </p>
            <p className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-[11px] font-medium text-brand shadow-sm">
              CIN: U65923GJ2018PTC104572
            </p>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-white">
            <div className="flex flex-col items-center gap-3">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light">
                <Handshake className="h-10 w-10 text-brand" strokeWidth={1.5} />
              </span>
              <p className="text-sm font-semibold text-ink">
                We&apos;re here to help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Footer                                                      */}
      {/* ---------------------------------------------------------- */}
      <footer id="contact" className="bg-navy pb-24 pt-16 text-white/70 sm:pb-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <a href="#home" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-extrabold text-white">
                U
              </span>
              <span className="text-lg font-bold text-white">Utkarsh Capital</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Fair, reliable loans from ₹50,000 to ₹50 lakh, tailored to your
              needs and business financial journey.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Quick Links</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {["Home", "About", "FAQ", "Contact", "Apply Now"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Legal</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {["Refund Policy", "Terms & Conditions", "Privacy Policy"].map(
                (l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">Contact Us</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-light" /> info@utkarshcapital.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-brand-light" />
                4th street, Colva, Goa, 403708
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <p className="text-center text-xs text-white/40">
            © {new Date().getFullYear()} Utkarsh Capital. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ---------------------------------------------------------- */}
      {/* Mobile sticky CTA                                           */}
      {/* ---------------------------------------------------------- */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/95 p-3 backdrop-blur sm:hidden">
        <a
          href="#home"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-white"
        >
          Apply Now <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </main>
  );
}
