import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../store/thunks/eventThunks';
import { fadeIn, slideIn, transitions } from '../../utils/animations';

interface CategoryForm {
  id?: string;
  name: string;
  type: 'Good' | 'Bad';
  points: number;
}

const EventCategories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector((state: RootState) => state.events);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CategoryForm>({
    name: '',
    type: 'Good',
    points: 10
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await dispatch(updateCategory({ ...form, id: isEditing })).unwrap();
      } else {
        await dispatch(createCategory(form)).unwrap();
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category: any) => {
    setForm({
      name: category.name,
      type: category.type,
      points: category.points
    });
    setIsEditing(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', type: 'Good', points: 10 });
    setIsEditing(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${fadeIn}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Categories</h1>
        <p className="text-gray-600">
          {(!categories || categories.length === 0) 
            ? "Let's set up event categories to track children's behavior."
            : "Manage your event categories and their point values."}
        </p>
      </div>

      {showForm && (
        <div className={`bg-white rounded-lg shadow-md p-6 mb-8 ${slideIn}`}>
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Category' : 'Add a Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'Good' | 'Bad' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="Good">Good</option>
                <option value="Bad">Bad</option>
              </select>
            </div>

            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                Points (10-100)
              </label>
              <input
                type="number"
                id="points"
                min="10"
                max="100"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`
                  flex-1 btn-primary
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  ${transitions.default}
                `}
              >
                {loading ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {(!categories || categories.length === 0) && !showForm ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No categories have been created yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category) => (
            <div
              key={category.id}
              className={`
                p-4 border rounded-lg
                hover:border-primary-500
                ${transitions.default}
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category.type} • {category.points} points
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                    title="Edit category"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                    title="Delete category"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showForm && categories?.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Add New Category
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCategories; 