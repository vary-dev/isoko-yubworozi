"use client";
export default function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-isoko-dark">Platform Analytics</h2>
        <p className="text-sm text-gray-400 mt-1">Track your platform performance and growth metrics</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-8 bg-gradient-to-br from-isoko-primary to-isoko-dark text-white rounded-[2rem]">
           <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Total Revenue</p>
           <h3 className="text-4xl font-black mt-2">1,240,000 <span className="text-lg opacity-60">RWF</span></h3>
           <div className="mt-6 flex items-center gap-2 text-xs font-bold text-isoko-accent">
              <i className="fa-solid fa-arrow-trend-up"></i> +12.5% vs last month
           </div>
        </div>
        <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Premium Subscribers</p>
           <h3 className="text-4xl font-black mt-2 text-isoko-dark">482</h3>
           <div className="mt-6 flex items-center gap-2 text-xs font-bold text-green-500">
              <i className="fa-solid fa-arrow-up"></i> +24 this week
           </div>
        </div>
        <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Book Downloads</p>
           <h3 className="text-4xl font-black mt-2 text-isoko-dark">3,120</h3>
           <div className="mt-6 flex items-center gap-2 text-xs font-bold text-green-500">
              <i className="fa-solid fa-arrow-up"></i> +156 this month
           </div>
        </div>
      </div>

      {/* Subscription List */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <h4 className="font-black text-isoko-dark uppercase text-sm tracking-widest mb-6">Recent Premium Access Tokens</h4>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-l-4 border-isoko-accent">
               <div>
                  <p className="font-bold text-sm">Farmer_{i*123}@gmail.com</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Purchased: Poultry Masterclass</p>
               </div>
               <span className="text-[10px] font-black text-isoko-primary bg-isoko-light px-3 py-1 rounded-lg">RW-TXN-9021{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
