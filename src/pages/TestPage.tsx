import Layout from "@/components/layout/Layout";

const TestPage = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🎉 App is Working! 🎉
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            If you can see this, the React app is running correctly.
          </p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success!</strong> The blank screen issue has been resolved.
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestPage;
