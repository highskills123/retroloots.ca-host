const { getServiceClient } = require("./_supabase");
const { toCatalogItem, CATALOG_COLUMNS } = require("./_catalog");
const { verifyAdminToken } = require("./_auth");

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method not allowed' };
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { statusCode: 503, body: JSON.stringify({ error: 'Catalogue temporarily unavailable' }) };
  }
  const authHeader = event.headers.authorization || event.headers.Authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const isAdmin = verifyAdminToken(token);
  const supabase = getServiceClient();

  let query = supabase
    .from("inventory")
    .select(CATALOG_COLUMNS)
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.eq("sold", false).eq('listed', true).gt('local_price', 0);
  }

  const { data, error } = await query;

  if (error) {
    return { statusCode: 503, body: JSON.stringify({ error: 'Catalogue temporarily unavailable' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify((data || []).map(item => toCatalogItem(item, isAdmin))),
  };
};
