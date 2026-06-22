const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? '(present)' : '(missing)');
console.log('Service Key:', supabaseServiceKey ? '(present)' : '(missing)');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing URL or Anon Key in .env.local');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing connection...');
  try {
    const { data, error } = await client.from('governorates').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Error fetching governorates:', error);
    } else {
      console.log('Success! Connection established. Governorates count:', data);
    }
  } catch (err) {
    console.error('Exception during test:', err);
  }
}

test();
