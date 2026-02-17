import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  SUPABASE_URL"https://vblwvnrepojcvbdcirns.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZibHd2bnJlcG9qY3ZiZGNpcm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMTE0NDUsImV4cCI6MjA4Njg4NzQ0NX0.IDmoZmOnWTlxusDKQE_Dpd-LdLTMZw7GEfQjrDSgO08" 

);
