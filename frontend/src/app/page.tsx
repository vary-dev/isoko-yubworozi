import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Guidance from "@/components/home/Guidance";
import Insights from "@/components/home/Insights";
import VideoGallery from "@/components/home/VideoGallery";
import BooksPreview from "@/components/home/BooksPreview";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Guidance />
      <Insights />
      <VideoGallery />
      <BooksPreview />

      {/* YouTube CTA Section */}
      <section className="py-20 bg-gradient-to-br from-isoko-dark via-isoko-primary to-isoko-dark text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-isoko-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20">
              <i className="fa-brands fa-youtube text-2xl text-white"></i>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
              Weekly Farming Tutorials on{" "}
              <span className="text-red-400">YouTube</span>
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
              Join thousands of farmers learning practical poultry and livestock
              skills through our weekly video content.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://youtube.com/@Isokoyubworozi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#FF0000] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-[#E00000] transition-all shadow-xl"
              >
                <i className="fa-brands fa-youtube text-lg"></i>
                Visit Our Channel
              </a>
              <a
                href="https://youtube.com/@Isokoyubworozi?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-white/20 transition-all"
              >
                <i className="fa-solid fa-bell"></i>
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
