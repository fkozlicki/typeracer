"use client";

import { createClient } from "@typeracer/supabase/client";
import { useEffect } from "react";

export default function GuestSignIn({
  isAuthenticated,
}: { isAuthenticated: boolean }) {
  const supabase = createClient();

  async function signIn() {
    await supabase.auth.signInAnonymously();
  }

  useEffect(() => {
    if (!isAuthenticated) {
      signIn();
    }
  }, []);

  return null;
}
