import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="grow pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
