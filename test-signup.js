import { createClient } from '@supabase/supabase-js';
import process from 'process';
process.loadEnvFile('.env.local');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test_error_script_' + Date.now() + '@example.com',
    password: 'Password123!',
    options: {
      data: {
        role: 'client',
        full_name: 'Test User',
      }
    }
  });
  if (error) {
    console.error("SIGNUP ERROR:", error);
    console.error("STRINGIFIED:", JSON.stringify(error));
  } else {
    console.log("SIGNUP SUCCESS:", data.user?.id);
  }
}
test();
