"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { UserSection } from "./UserSection";

interface SidebarProps {
  user: any;
}

const SIDEBAR_STATE_KEY = "sidebar-collapsed";

function getInitialSidebarState(): boolean {
  if (typeof window === "undefined") return false;
  const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
  return savedState === "true";
}

export function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(getInitialSidebarState);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16 items-center" : "w-64"
        )}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        <div className="flex-1 space-y-1 p-2">
          <SidebarNavigation isCollapsed={isCollapsed} />
        </div>

        <UserSection user={user} isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
