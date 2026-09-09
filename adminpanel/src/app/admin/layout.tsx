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
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-ink/5 bg-white/80 px-6 backdrop-blur-xl lg:px-10">
            <div className="hidden lg:block">
               <span className="text-[10px] font-extrabold uppercase text-leaf tracking-[.18em]">Isoko y&apos;Ubworozi</span>
               <h2 className="font-display text-sm font-semibold">Publishing command centre</h2>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-6 ml-auto lg:ml-0">
              <div className="flex items-center gap-3 rounded-full border border-leaf/10 bg-leaf/5 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-leaf"></div>
                <span className="hidden text-[10px] font-extrabold uppercase text-forest sm:block">Verified session</span>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-xs font-extrabold text-white">AD</div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="p-5 sm:p-7 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
