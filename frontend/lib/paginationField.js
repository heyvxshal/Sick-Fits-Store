import { PAGINATION_QUERY } from '../components/Pagination';

export default function PaginationField() {
  return {
    keyArgs: false, // Manual Override for Apollo
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read number of items on tha page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });

      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check for Existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If
      // If items are there
      // AND there aren't enough items to satisft how many were requested
      // AND we are on the last page
      // THEN JUST SEND IT

      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // don't have any items, fetch from network
        return false;
      }

      // If items are present, just return them from the cache, and don't fetch from network
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the cache, send then to apollo`
        // );
      }
      return items; // Fallback to network
    },

    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // runs when apollo client return from the network with our product
      // console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }

      // Return the merged items from the cache
      return merged;
    },
  };
}
