import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_APP_ENDPOINT, SUPABASE_ADMIN_PASSWORD } from '$env/static/private';
const url = SUPABASE_APP_ENDPOINT;
const key = SUPABASE_ADMIN_PASSWORD;

if (!url) throw new Error('SUPABASE_APP_ENDPOINT must be set');
if (!key) throw new Error('SUPABASE_ADMIN_PASSWORD must be set');
export const supabase: SupabaseClient = createClient(url, key);
