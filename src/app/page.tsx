import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col" data-scroll-section>
      <Header />
      <main className="flex-1" data-scroll-section>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6" data-scroll data-scroll-speed="0.5">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Welcome to fastapi_comm
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted e-commerce platform for quality products and exceptional service.
            </p>
          </div>
        </div>
      </main>
      <Footer data-scroll-section />
    </div>
  );
}
