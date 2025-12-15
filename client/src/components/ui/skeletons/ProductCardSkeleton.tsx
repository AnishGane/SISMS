interface ProductCardSkeletonProps {
  layout: 'grid' | 'table';
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ layout }) => {
  if (layout === 'table') {
    return (
      <div className="flex animate-pulse items-center gap-4 rounded-md border p-1.5">
        <div className="mr-4 size-32 rounded-md bg-gray-300/60" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-[20%] rounded-md bg-gray-300/60" />
          <div className="h-4 w-[45%] rounded-md bg-gray-300/60" />
          <div className="h-8 w-full rounded-md bg-gray-200" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 rounded-md bg-gray-300/60" />
            <div className="h-4 w-16 rounded-md bg-gray-300/60" />
            <div className="h-4 w-16 rounded-md bg-gray-300/60" />
          </div>
        </div>
      </div>
    );
  }

  // Grid skeleton
  return (
    <div className="animate-pulse rounded-md border">
      <div className="roundedt-md mb-3 h-56 w-full bg-gray-300/60" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-[20%] rounded-md bg-gray-300/60" />
        <div className="h-4 w-3/4 rounded-md bg-gray-300/60" />
        <div className="h-8 w-full rounded-md bg-gray-200" />
        <div className="flex items-center justify-between gap-10">
          <div className="h-4 w-2/3 rounded-md bg-gray-300/60" />
          <div className="h-4 w-1/3 rounded-md bg-gray-300/60" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
