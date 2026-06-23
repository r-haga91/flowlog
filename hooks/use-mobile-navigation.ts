"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setIsOpen(false), [pathname]);

  return { isOpen, setIsOpen, pathname };
}
