import React, { useState } from 'react';
import { Download, X, Smartphone, Wifi, WifiOff } from 'lucide-react';

interface PWAInstallBannerProps {
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  isOffline,
  onToggleOffline
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  if (dismissed && !isOffline) return null;

  return (
    <div className="space-y-2 mb-4">
      {/* Offline Alert Simulation */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>You are currently browsing in <strong>Offline Mode</strong>. Cached appointments and reports are available.</span>
          </div>
          <button
            id="pwa-reconnect-btn"
            onClick={onToggleOffline}
            className="bg-white text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-xs hover:bg-amber-50"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* PWA App Install Callout Banner */}
      {!installed && !dismissed && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                Install Reveal Clinic App <span className="bg-blue-500/30 text-blue-300 text-[10px] px-2 py-0.5 rounded-full uppercase">PWA</span>
              </div>
              <div className="text-[11px] text-slate-300 leading-tight">
                Add to your home screen for quick digital check-in & offline medical reports.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="pwa-install-app-btn"
              onClick={() => {
                setInstalled(true);
                alert("Reveal Clinic PWA added to Home Screen successfully!");
              }}
              className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Install
            </button>
            <button
              id="pwa-dismiss-banner-btn"
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
