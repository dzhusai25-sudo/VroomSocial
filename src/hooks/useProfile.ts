import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "../lib/supabase";

export function useProfile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();
      if (data) setDisplayName(data.display_name);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const updateDisplayName = async (newName: string) => {
    if (!user) return false;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: newName });
    if (error) {
      console.error(error);
      return false;
    }
    setDisplayName(newName);
    return true;
  };

  return { displayName, loading, updateDisplayName };
}