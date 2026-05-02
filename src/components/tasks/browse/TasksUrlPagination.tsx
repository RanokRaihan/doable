"use client";

import { TaskPagination } from "@/components/tasks/TaskPagination";
import { PaginationMeta } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function TasksUrlPagination({ meta }: { meta: PaginationMeta }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = useCallback(
    (page: number) => {
      const current = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        current.delete("page");
      } else {
        current.set("page", String(page));
      }
      const query = current.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, pathname, router],
  );

  return <TaskPagination meta={meta} onPageChange={handlePageChange} />;
}
