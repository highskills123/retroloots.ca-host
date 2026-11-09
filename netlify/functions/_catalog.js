// Map the current inventory schema to the recovered storefront contract.
function imageList(item) {
  const photos = Array.isArray(item.photos) ? item.photos : [];
  const urls = [item.image_url, ...photos.map(photo => typeof photo === 'string' ? photo : photo?.public_url || photo?.url)];
  return [...new Set(urls.filter(url => typeof url === 'string' && (/^https:\/\//i.test(url) || /^\/?inventory\/images\//.test(url))))];
}

function toCatalogItem(item, admin = false) {
  const price = item.local_price == null ? null : Number(item.local_price);
  const result = {
    id: item.id,
    title: item.title || '',
    category: item.category || '',
    price: Number.isFinite(price) && price > 0 ? price : null,
    images: imageList(item),
    description_en: item.description || '',
    description_fr: item.description || '',
    date: item.created_at ? String(item.created_at).slice(0, 10) : '',
    created_at: item.created_at,
  };
  if (admin) Object.assign(result, { sold: Boolean(item.sold), listed: Boolean(item.listed) });
  return result;
}

const CATALOG_COLUMNS = 'id,title,category,local_price,image_url,photos,description,created_at,sold,listed';
module.exports = { toCatalogItem, CATALOG_COLUMNS };
