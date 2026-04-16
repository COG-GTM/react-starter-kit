import {
  AcquisitionCard,
  PageVisitsTable,
  ProgressTrack,
  RankingsCard,
  SalesValueCard,
  StatCards,
  TeamMembers,
  TotalOrdersCard,
} from "@/components/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Sales Value Chart */}
      <SalesValueCard />

      {/* Stat Cards Row */}
      <StatCards />

      {/* Page Visits Table + Total Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PageVisitsTable />
        </div>
        <TotalOrdersCard />
      </div>

      {/* Team Members + Progress Track */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamMembers />
        <ProgressTrack />
      </div>

      {/* Rankings + Acquisition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankingsCard />
        <AcquisitionCard />
      </div>
    </div>
  );
}
