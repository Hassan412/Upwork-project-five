import ClientResultComponent from "@/components/ClientResultComponent";
import DropDownComponent from "@/components/DropDownComponent";
import GetStartedComponent from "@/components/GetStartedComponent";
import Hero from "@/components/Hero";
import PerformanceComponent from "@/components/PerformanceComponent";
import SliderComponent from "@/components/SliderComponent";
import SocialComponent from "@/components/SocialComponent";
import WhyViewpalComponent from "@/components/WhyViewpalComponent";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-[#101010] text-white overflow-x-hidden">
      <Hero />
      <SliderComponent/>
      <WhyViewpalComponent />
      <div className="px-4 md:px-16 lg:px-32">
      <GetStartedComponent />
      <ClientResultComponent /> 
      <PerformanceComponent />
      <DropDownComponent />
      <SocialComponent />
      </div>
      <Footer />
    </main>
  );
}
