const assert = require('node:assert/strict');
const {toCatalogItem} = require('../netlify/functions/_catalog');
const source = {id:'one', title:'Example', local_price:'12.50', suggested_price:99,
  purchase_price:2, notes:'private', sold:false, listed:true,
  image_url:'https://example.com/a.webp', photos:['https://example.com/a.webp', {public_url:'https://example.com/b.webp'}, 'javascript:bad'],
  description:'Description', created_at:'2026-01-02T12:00:00Z'};
const actual = toCatalogItem(source);
assert.equal(actual.price,12.5);
assert.equal(actual.date,'2026-01-02');
assert.deepEqual(actual.images,['https://example.com/a.webp','https://example.com/b.webp']);
for (const field of ['purchase_price','notes','suggested_price','sold','listed']) assert.equal(field in actual,false);
assert.equal(toCatalogItem({...source,local_price:null}).price,null);
assert.equal(toCatalogItem({...source,local_price:'invalid'}).price,null);
assert.equal(toCatalogItem(source,true).listed,true);
console.log('Catalogue mapping checks passed');
