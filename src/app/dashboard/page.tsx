"use client";

import { Suspense } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <AppLayout>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </AppLayout>
  );
}
