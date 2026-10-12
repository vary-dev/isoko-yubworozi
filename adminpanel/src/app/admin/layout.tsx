import AdminSidebar from "@/components/layout/AdminSidebar";
import AuthGuard from "@/components/layout/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-mist">
        <AdminSidebar />
        
        {/* Main Content Area: Responsive Margin */}
        <div className="lg:ml-72 min-h-screen">
          {/* Top Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink/5 bg-white/90 pl-16 pr-4 backdrop-blur-xl sm:px-20 lg:h-20 lg:px-10">
            <div>
               <span className="text-[9px] font-extrabold uppercase tracking-[.14em] text-leaf sm:text-[10px] sm:tracking-[.18em]">Isoko y&apos;Ubworozi</span>
               <h2 className="font-display text-xs font-semibold sm:text-sm">Admin workspace</h2>
            </div>
            
            {/* Right Section */}
            <div className="ml-2 flex items-center gap-2 sm:gap-4 lg:ml-0">
              <div className="flex items-center gap-2 rounded-full border border-leaf/10 bg-leaf/5 px-2.5 py-2 sm:gap-3 sm:px-4">
                <div className="h-2 w-2 rounded-full bg-leaf"></div>
                <span className="hidden text-[10px] font-extrabold uppercase text-forest sm:block">Verified session</span>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-[10px] font-extrabold text-white sm:h-10 sm:w-10 sm:text-xs">AD</div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="min-w-0 p-4 sm:p-7 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
