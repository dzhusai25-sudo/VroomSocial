import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export function RequireProfile({ children }: { children: React.ReactElement }) {
  const { user, loading: authLoading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const checkProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();
      if (data?.display_name) {
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
      setLoading(false);
    };
    checkProfile();
  }, [user]);

  if (authLoading || loading) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (hasProfile === false) return <Navigate to="/profile" replace />;
  return children;
}
