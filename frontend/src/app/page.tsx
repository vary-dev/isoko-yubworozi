import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Guidance from "@/components/home/Guidance";
import Insights from "@/components/home/Insights";
import VideoGallery from "@/components/home/VideoGallery";
import BooksPreview from "@/components/home/BooksPreview";
import Footer from "@/components/layout/Footer";
import BrandStory from "@/components/home/BrandStory";
import YouTubeCta from "@/components/home/YouTubeCta";

export default function Home() {
  return (
    <main id="main-content" className="relative">
      <Navbar />
      <Hero />
      <Guidance />
      <BrandStory />
      <Insights />
      <VideoGallery />
      <BooksPreview />

      <YouTubeCta />

      <Footer />
    </main>
  );
}
