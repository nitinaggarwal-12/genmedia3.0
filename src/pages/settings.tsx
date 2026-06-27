import { Plus, MoreVertical, Database, Info } from 'lucide-react';

const SettingsSection = ({ title, description, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-8">
    <div className="mb-8">
      <h3 className="font-display text-2xl text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    {children}
  </div>
);

export function Settings() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50/50">
      <section className="relative px-8 pt-12 pb-24 overflow-hidden bg-slate-100">
        <div className="flex flex-col gap-2 mb-12">
          <span className="font-mono text-xs text-blue-600 uppercase tracking-[0.2em]">System Architecture</span>
          <h1 className="font-display text-6xl leading-none tracking-tighter text-slate-900">Core Infrastructure</h1>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl p-8 shadow-sm flex flex-col justify-between min-h-[320px]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-display text-lg text-slate-900 mb-1">Network Gateway Status</h2>
                <p className="text-sm text-slate-500 max-w-md">Real-time throughput monitoring across global edge nodes.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 rounded-full">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="font-body text-xs font-bold text-blue-600">Operational</span>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-xl p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-1">
              <Database className="text-white/80" />
              <h3 className="font-display text-lg text-white">Storage Cluster</h3>
            </div>
            <div className="py-8">
              <div className="flex justify-between items-end mb-2">
                <span className="font-display text-5xl text-white tracking-tight">84.2<span className="text-2xl opacity-50">%</span></span>
                <span className="font-body text-xs font-bold text-white/80 pb-2">12.4 TB / 15 TB</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/80 rounded-full" style={{ width: '84.2%' }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Info className="h-4 w-4" />
              <span className="font-body text-xs uppercase tracking-wider">Projected limit in 14 days</span>
            </div>
          </div>
        </div>
      </section>
      <section className="px-8 -mt-12 pb-24">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <SettingsSection title="External Integrations" description="Connect third-party endpoints and manage secret keys.">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-body text-sm font-bold text-slate-800">Data Warehouse Sink</p>
                      <p className="font-sans text-xs text-slate-500">Last ping 4m ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <code className="bg-slate-200 px-3 py-1 rounded text-xs font-mono">pk_live_************928a</code>
                    <MoreVertical className="text-slate-400 cursor-pointer hover:text-slate-800" />
                  </div>
                </div>
              </div>
            </SettingsSection>
          </div>
        </div>
      </section>
    </div>
  );
}
