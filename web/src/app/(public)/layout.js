import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
