"use client";

import { Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectContent } from "@/components/project/project-content";
import { ProjectSkeleton } from "@/components/skeletons/project-skeleton";

export default function ProjectDetailPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent user={user!} />
      </Suspense>
    </AppLayout>
  );
}
