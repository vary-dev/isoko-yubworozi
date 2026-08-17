import AdminSidebar from "@/components/layout/AdminSidebar";
import AuthGuard from "@/components/layout/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F9FBF9]">
        <AdminSidebar />
        
        {/* Main Content Area: Responsive Margin */}
        <div className="lg:ml-72 min-h-screen">
          {/* Top Header */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40">
            <div className="hidden lg:block">
               <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Isoko y&apos;Ubworozi</span>
               <h2 className="text-isoko-dark font-black uppercase tracking-tight">Management Console</h2>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-6 ml-auto lg:ml-0">
              <div className="flex items-center gap-3 bg-isoko-light/50 px-4 py-2 rounded-full border border-isoko-light">
                <div className="w-2 h-2 bg-isoko-accent rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-isoko-primary uppercase hidden sm:block">API Online</span>
              </div>
              <div className="w-10 h-10 bg-isoko-dark rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg">AD</div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="p-6 lg:p-12">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
