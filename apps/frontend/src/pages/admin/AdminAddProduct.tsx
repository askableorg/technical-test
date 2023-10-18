import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProductsQuery } from '@/api/useProductsQuery';
import { getErrorMessage } from '@/utils';

type Categories = 'Sneakers' | 'Clothing' | 'Watches' | 'Hats';

type FormData = {
  title: string;
  price: string;
  category: Categories;
};

const categories: Categories[] = ['Sneakers', 'Clothing', 'Watches', 'Hats'];

const initialFormData: FormData = {
  title: '',
  price: '',
  category: categories[0]
};

const AdminAddProduct = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const navigate = useNavigate();
  const { addProduct } = useProductsQuery();
  const { mutate, isLoading, isError, error } = addProduct();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await mutate(formData);
    navigate('/admin/products?added=true');
  };

  return (
    <div className="content-narrow centered">
      <header className="stack-quarter sticky">
        <Link to="/admin/products" className="button-back text-small">
          &larr; Back
        </Link>

        <h1>Add Product</h1>
      </header>
      <main>
        <form className="stack" onSubmit={handleSubmit}>
          {isError ? <div className="callout critical">{getErrorMessage(error)}</div> : null}

          <div className="stack-quarter">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="stack-quarter">
            <label htmlFor="price">Price</label>
            <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="stack-quarter">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
              {categories.map((category) => (
                <option value={category} key={`category-${category}`}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button className="button" disabled={isLoading}>
              {isLoading ? 'Adding' : 'Add Product'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminAddProduct;
export type { FormData };
