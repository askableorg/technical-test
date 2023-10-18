import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Product Sort
 * Sort and size options to modify the /products listings
 * Persist selections in the URL
 * @emit { size, sortBy, desc }
 */

type SortBy = {
  id: string;
  desc: boolean;
  label: string;
  value: 'title' | 'price' | 'created_at';
};

type SortParams = {
  size: number;
  sortBy: string;
  desc: boolean;
};

const sortBys: SortBy[] = [
  { id: '1', value: 'title', desc: false, label: 'Title A to Z' },
  { id: '2', value: 'title', desc: true, label: 'Title Z to A' },
  { id: '3', value: 'price', desc: true, label: 'Highest Price' },
  { id: '4', value: 'price', desc: false, label: 'Lowest Price' },
  { id: '5', value: 'created_at', desc: true, label: 'Latest' },
  { id: '6', value: 'created_at', desc: false, label: 'Oldest' }
];

const sizes = [
  { value: 10, label: '10 items' },
  { value: 25, label: '25 items' },
  { value: 50, label: '50 items' }
];

const ProductSort = ({ onChange }: { onChange: (params: SortParams) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sortBy, setSortBy] = useState<SortBy>(sortBys[0]);
  const [size, setSize] = useState(sizes[2].value);

  const updateSortBy = (id: string) => {
    setSortBy(sortBys.find((item) => item.id === id) ?? sortBys[0]);
  };

  useEffect(() => {
    // Update URL params with sort
    const searchParams = new URLSearchParams();
    searchParams.set('sortBy', sortBy.id);
    searchParams.set('size', size.toString());
    navigate({ pathname: location.pathname, search: searchParams.toString() });

    // Emit the sort params to refetch data
    onChange({ size, sortBy: sortBy.value, desc: sortBy.desc });
  }, [sortBy, size]);

  useEffect(() => {
    // Use the sort params from URL on load
    const searchParams = new URLSearchParams(location.search);
    const sortByParam = searchParams.get('sortBy');
    const sizeParam = searchParams.get('size');

    if (sortByParam) {
      const sortByItem = sortBys.find((item) => item.id === sortByParam);
      if (sortByItem) {
        setSortBy(sortByItem);
      }
    }

    if (sizeParam) {
      setSize(Number(sizeParam));
    }
  }, []);

  return (
    <div className="inline inline-wrap text-small">
      <div className="inline-half">
        <label htmlFor="sortBy">Sort by:</label>
        <select value={sortBy.id} onChange={(e) => updateSortBy(e.target.value)} id="sortBy">
          {sortBys.map((item) => (
            <option value={item.id} key={`sortby-${item.id}`}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="inline-half">
        <label htmlFor="size">Per page:</label>
        <select value={size} onChange={(e) => setSize(Number(e.target.value))} id="size">
          {sizes.map((item) => (
            <option value={item.value} key={`size-${item.value}`}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductSort;
export type { SortParams };
