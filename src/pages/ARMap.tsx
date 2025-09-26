import Layout from "@/components/layout/Layout";
import ARMapComponent from "@/components/ARMapComponent";

const ARMap = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              AR Street View Maps
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore tourist destinations with immersive Street View and AR-enhanced experiences
            </p>
          </div>
          
          <ARMapComponent />
        </div>
      </div>
    </Layout>
  );
};

export default ARMap;
