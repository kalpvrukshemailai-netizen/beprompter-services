import { createClient } from '@supabase/supabase-js';

const projectId = "mnldkagiwjjkbxlupccn";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubGRrYWdpd2pqa2J4bHVwY2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTAxMTUsImV4cCI6MjEwMDg4NjExNX0.qe2vaPELfpcEgOsBI7SUbBE3NLdwU_wLX2Mh7R8_4f4";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

async function test() {
  console.log("Testing signup...");
  const { data, error } = await supabase.auth.signUp({
    email: 'test_error_script_' + Date.now() + '@example.com',
    password: 'Password123!',
    options: {
      data: {
        role: 'client',
        full_name: 'Test User',
        company_name: 'Test Corp'
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
