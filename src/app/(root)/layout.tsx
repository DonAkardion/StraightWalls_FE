import { Header } from "@/components/Main/Header/Header";
import { Footer } from "@/components/Main/Footer/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Header />

      {children}

      {/* <section id="contacts">
        <Contacts />
      </section> */}

      <Footer />
    </div>
  );
}
