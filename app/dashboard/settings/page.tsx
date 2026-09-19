"use client";

import { useState } from "react";
import { Bell, Lock, Globe, Trash2 } from "lucide-react";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-brand" : "bg-black/10"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Settings</h1>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2.5 text-base font-bold text-ink">
          <Bell className="h-4 w-4 text-brand" /> Notifications
        </h2>
        <div className="mt-4 divide-y divide-black/5">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-ink">SMS alerts</p>
              <p className="text-xs text-muted">
                Get application status updates by SMS.
              </p>
            </div>
            <Toggle checked={smsAlerts} onChange={() => setSmsAlerts((v) => !v)} />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-ink">Email alerts</p>
              <p className="text-xs text-muted">
                Receive letters and receipts over email.
              </p>
            </div>
            <Toggle
              checked={emailAlerts}
              onChange={() => setEmailAlerts((v) => !v)}
            />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-ink">WhatsApp updates</p>
              <p className="text-xs text-muted">
                Get reminders from your relationship manager on WhatsApp.
              </p>
            </div>
            <Toggle
              checked={whatsappUpdates}
              onChange={() => setWhatsappUpdates((v) => !v)}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2.5 text-base font-bold text-ink">
          <Lock className="h-4 w-4 text-brand" /> Security
        </h2>
        <button className="mt-4 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-ink/80 hover:border-brand hover:text-brand">
          Change mobile number
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2.5 text-base font-bold text-ink">
          <Globe className="h-4 w-4 text-brand" /> Language
        </h2>
        <select className="mt-4 w-full max-w-xs rounded-lg border border-black/10 px-3 py-2.5 text-sm text-ink focus:border-brand focus:outline-none sm:w-auto">
          <option>English</option>
          <option>हिन्दी</option>
        </select>
      </div>

      <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-5 sm:p-6">
        <h2 className="flex items-center gap-2.5 text-base font-bold text-red-600">
          <Trash2 className="h-4 w-4" /> Delete account
        </h2>
        <p className="mt-2 text-sm text-red-700/80">
          This permanently removes your profile and application data.
        </p>
        <button className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100">
          Request account deletion
        </button>
      </div>
    </div>
  );
}
