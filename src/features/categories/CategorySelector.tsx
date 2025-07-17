import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchCategories } from './categoriesSlice';

interface CategorySelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function CategorySelector(props: CategorySelectorProps) {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector((state: RootState) => state.categories.items);
  const status = useSelector((state: RootState) => state.categories.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return (
    <select {...props}>
      <option value="">בחר קטגוריה</option>
      {categories.map((category: any) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

export default CategorySelector;
