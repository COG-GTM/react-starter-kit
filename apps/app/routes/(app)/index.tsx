import {
  Footer,
  LatestCustomers,
  SalesChart,
  SessionsCountry,
  SessionsDevice,
  StatCards,
  TransactionsTable,
} from "@/components/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <SalesChart />
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SessionsCountry />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <LatestCustomers />
          <SessionsDevice />
        </div>
      </div>

      <TransactionsTable />
      <Footer />
    </div>
  );
}
