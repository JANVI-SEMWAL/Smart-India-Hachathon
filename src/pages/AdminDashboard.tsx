import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { approveArtisan, getPendingArtisans } from "@/lib/mockApi";

export default function AdminDashboard() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const res = await getPendingArtisans();
    if (res.success) setPending(res.artisans);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleApprove = async (email: string) => {
    setLoading(true);
    const res = await approveArtisan(email);
    if (res.success) {
      await refresh();
      alert("Artisan approved");
    } else {
      alert(res.message || "Failed to approve");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Approve newly registered artisans after phone verification.</p>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Pending Artisans</h2>
              <Button variant="outline" onClick={refresh} disabled={loading}>Refresh</Button>
            </div>
            {pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending artisans.</p>
            ) : (
              <div className="space-y-3">
                {pending.map((a) => (
                  <div key={a.email} className="flex items-center justify-between border rounded-md p-3">
                    <div>
                      <div className="font-medium">{(a.data?.fullName as string) || "Unknown"} <Badge className="ml-2">{a.data?.businessName as string}</Badge></div>
                      <div className="text-xs text-muted-foreground">{a.email} • {a.phone}</div>
                    </div>
                    <Button onClick={() => handleApprove(a.email)} disabled={loading}>Approve</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


