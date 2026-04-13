const ProductSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-white border border-gray-100">
    <div className="shimmer aspect-[3/4] w-full" />
    <div className="p-4 space-y-3">
      <div className="shimmer h-4 w-3/4 rounded" />
      <div className="shimmer h-3 w-1/2 rounded" />
      <div className="shimmer h-8 w-full rounded-lg" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export default ProductSkeleton;
