"use client";

import { User, Landmark, TrendingUp, MessageSquare } from "lucide-react";

const PROFILE = {
  name: "Rahul Kumar",
  email: "rahul.kumar@example.com",
  mobile: "77393 10429",
  whatsapp: "77393 10429",
  kycStatus: "KYC Done",
};

const BANK = {
  bankName: "Canara Bank",
  accountNumber: "364200056193688",
  ifsc: "CNRB0003642",
  accountHolder: "Rahul Kumar",
};

const LOAN = {
  amount: 800000,
  tenureMonths: 18,
  emi: 47678,
  status: "In Progress",
};

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-2.5 text-base font-bold text-ink">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-2.5 text-sm">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p>
      <span className="font-semibold text-ink">{label}:</span>{" "}
      <span className="text-muted">{value}</span>
    </p>
  );
}

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Profile</h1>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <InfoCard icon={User} title="Personal Information">
          <Row label="Name" value={PROFILE.name} />
          <Row label="Email" value={PROFILE.email} />
          <Row label="Mobile" value={PROFILE.mobile} />
          <Row label="WhatsApp" value={PROFILE.whatsapp} />
          <p>
            <span className="font-semibold text-ink">KYC Status:</span>{" "}
            <span className="font-semibold text-brand">{PROFILE.kycStatus}</span>
          </p>
        </InfoCard>

        <InfoCard icon={Landmark} title="Bank Details">
          <Row label="Bank" value={BANK.bankName} />
          <Row label="Account No" value={BANK.accountNumber} />
          <Row label="IFSC" value={BANK.ifsc} />
          <Row label="Account Holder" value={BANK.accountHolder} />
        </InfoCard>

        <InfoCard icon={TrendingUp} title="Loan Details">
          <Row label="Loan Amount" value={formatINR(LOAN.amount)} />
          <Row label="Tenure" value={`${LOAN.tenureMonths} months`} />
          <Row label="EMI" value={formatINR(LOAN.emi)} />
          <Row label="Status" value={LOAN.status} />
        </InfoCard>

        <InfoCard icon={MessageSquare} title="Support">
          <p className="text-muted">
            Need help? Chat directly with your relationship manager.
          </p>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-white">
            Chat on WhatsApp
          </button>
        </InfoCard>
      </div>
    </div>
  );
}
