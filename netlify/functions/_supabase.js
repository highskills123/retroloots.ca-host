const { createClient } = require("@supabase/supabase-js");

function createSupabaseClient(key) {
  if (!process.env.SUPABASE_URL || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(process.env.SUPABASE_URL, key);
}

function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('Missing server-side Supabase key');
  return createSupabaseClient(serviceKey);
}

module.exports = {
  getServiceClient,
};
