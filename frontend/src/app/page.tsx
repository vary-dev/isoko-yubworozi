import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import Insights from '@/components/home/Insights';
import VideoGallery from '@/components/home/VideoGallery';
import BooksPreview from '@/components/home/BooksPreview';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Insights />
      <VideoGallery />
      <BooksPreview />
      
      {/* Blog/News Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-isoko-dark mb-12">Farming News & Blog</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* We will map Articles here later */}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}