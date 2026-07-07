"use client";

import HeaderProfile from "@/app/components/ui/profiles/HeaderProfile";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    })();
  }, []);
  return (
    <div>
      <header className="fixed inset-0 w-full h-max px-3 sm:px-6 bg-foreground border-b border-border z-500">
        <div className="h-20 flex items-center justify-between">
          <a className="flex items-center" href="/">
            <img src="/fluens.png" className="w-16" />
            <div className="ml-2">
              <div className="font-black tracking-widest leading-5 text-2xl text-transparent bg-linear-to-bl from-brand-light via-brand to-brand-dark bg-clip-text">
                Echo
              </div>
              <hr className="border-brand my-1 rounded-full" />
              <div className="font-bold tracking-widest leading-2 text-[0.5rem] text-brand-light">
                FORM BUILDER
              </div>
            </div>
          </a>
          <HeaderProfile {...{ user }} />
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
