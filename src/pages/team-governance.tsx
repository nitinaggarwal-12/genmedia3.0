import { Filter, UserPlus, MoreVertical, ShieldCheck, Banknote, Mail, CheckCircle2, CircleDot, Circle } from 'lucide-react';

const teamMembers = [
  {
    name: 'Julianne DeMarco',
    email: 'j.demarco@maestro.ai',
    role: 'Compliance Lead',
    status: 'Active',
    avatar: 'JD',
    avatarColor: 'bg-secondary-container text-on-secondary-container',
  },
  {
    name: 'Elias Thorne',
    email: 'e.thorne@maestro.ai',
    role: 'Clinical Architect',
    status: 'Active',
    avatar: 'ET',
    avatarColor: 'bg-tertiary-container text-on-tertiary-container',
  },
  {
    name: 'Marcus Kray',
    email: 'm.kray@external.com',
    role: 'MLR Auditor',
    status: 'Pending',
    avatar: 'MK',
    avatarColor: 'bg-slate-200 text-slate-500',
  },
];

const MemberRow = ({ member }) => (
  <tr className="hover:bg-slate-100/50 transition-colors group">
    <td className="px-6 py-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-lg ${member.avatarColor}`}>{member.avatar}</div>
        <div>
          <div className="font-body font-bold text-sm text-slate-800">{member.name}</div>
          <div className="font-sans text-xs text-slate-500">{member.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-5">
      <span className="font-sans text-sm text-slate-700">{member.role}</span>
    </td>
    <td className="px-6 py-5">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.status === 'Active' ? 'bg-blue-600/10 text-blue-600' : 'bg-slate-200 text-slate-500 italic'}`}>
        {member.status}
      </span>
    </td>
    <td className="px-6 py-5 text-right">
      <button className="text-slate-400 hover:text-blue-600 transition-colors">
        {member.status === 'Pending' ? <Mail className="h-5 w-5" /> : <MoreVertical className="h-5 w-5" />}
      </button>
    </td>
  </tr>
);

export function TeamGovernance() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50/50">
      <section className="relative w-full overflow-hidden bg-slate-100 pt-12 pb-24 px-8">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl text-slate-900 mb-4">Authority & Protocol</h1>
            <p className="font-sans text-base text-slate-600 max-w-lg">
              Configure deep-level permissions and role hierarchies across clinical, regulatory, and financial domains.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-start min-w-[160px]">
              <span className="font-body text-xs text-slate-500 uppercase tracking-wider mb-2">Total Seats</span>
              <span className="font-display text-4xl text-slate-900">142<span className="text-2xl text-slate-400">/150</span></span>
            </div>
            <div className="bg-blue-600 p-6 rounded-xl shadow-lg shadow-blue-600/20 flex flex-col items-start min-w-[160px]">
              <span className="font-body text-xs text-white/70 uppercase tracking-wider mb-2">Active Roles</span>
              <span className="font-display text-4xl text-white">12</span>
            </div>
          </div>
        </div>
      </section>
      <div className="px-8 -mt-12 mb-24 grid grid-cols-12 gap-6 relative z-20">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
            <h2 className="font-display text-lg text-slate-900">Personnel Directory</h2>
            <div className="flex gap-3">
              <button className="flex items-center bg-slate-100 px-4 py-2 rounded-lg gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="font-body text-xs font-bold text-slate-600">Filter Status</span>
              </button>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-body text-xs font-bold flex items-center gap-2 hover:translate-y-[-1px] transition-transform">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">User Identity</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Global Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Node Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {teamMembers.map((member, i) => <MemberRow key={i} member={member} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
