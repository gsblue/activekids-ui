import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchChildren, addChild, updateChild, deleteChild } from '../../store/thunks/familyThunks';
import { transitions, fadeIn, slideIn } from '../../utils/animations';
import { Child } from '../../types';

interface ChildForm {
  id?: string;
  firstName: string;
  birthMonth: string;
  birthYear: string;
}

const FamilyConfig: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const children = useSelector((state: RootState) => state.family.children);
  const loading = useSelector((state: RootState) => state.family.loading);
  const [childForm, setChildForm] = useState<ChildForm>({
    firstName: '',
    birthMonth: '',
    birthYear: '',
  });
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  useEffect(() => {
    if (children === null) {
      dispatch(fetchChildren());
    }
  }, [dispatch, children]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChild) {
        await dispatch(updateChild({
          id: editingChild.id,
          firstName: childForm.firstName,
          birthMonth: parseInt(childForm.birthMonth),
          birthYear: parseInt(childForm.birthYear),
        })).unwrap();
        setEditingChild(null);
      } else {
        await dispatch(addChild({
          firstName: childForm.firstName,
          birthMonth: parseInt(childForm.birthMonth),
          birthYear: parseInt(childForm.birthYear),
        })).unwrap();
      }
      
      resetForm();
      
      if (children === null || children.length === 0) {
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to save child:', err);
    }
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setChildForm({
      firstName: child.firstName,
      birthMonth: child.birthMonth.toString(),
      birthYear: child.birthYear.toString(),
    });
  };

  const handleDelete = async (childId: string) => {
    if (window.confirm('Are you sure you want to remove this child?')) {
      try {
        await dispatch(deleteChild(childId)).unwrap();
      } catch (err) {
        console.error('Failed to delete child:', err);
      }
    }
  };

  const resetForm = () => {
    setChildForm({ firstName: '', birthMonth: '', birthYear: '' });
    setEditingChild(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${fadeIn}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Configuration</h1>
        <p className="text-gray-600">
          {children === null || children.length === 0 
            ? "Let's set up your family profile by adding your children."
            : "Manage your family members and settings."}
        </p>
      </div>

      <div className={`bg-white rounded-lg shadow-md p-6 mb-8 ${slideIn}`}>
        <h2 className="text-xl font-semibold mb-4">
          {editingChild ? 'Edit Child' : 'Add a Child'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Child's Name
            </label>
            <input
              type="text"
              id="firstName"
              required
              className="mt-1 input-primary"
              value={childForm.firstName}
              onChange={(e) => setChildForm({ ...childForm, firstName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthMonth" className="block text-sm font-medium text-gray-700">
                Birth Month
              </label>
              <select
                id="birthMonth"
                required
                className="mt-1 input-primary"
                value={childForm.birthMonth}
                onChange={(e) => setChildForm({ ...childForm, birthMonth: e.target.value })}
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700">
                Birth Year
              </label>
              <select
                id="birthYear"
                required
                className="mt-1 input-primary"
                value={childForm.birthYear}
                onChange={(e) => setChildForm({ ...childForm, birthYear: e.target.value })}
              >
                <option value="">Select Year</option>
                {Array.from({ length: 18 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {children === null && (
            <div className="text-red-500 text-sm">Loading children...</div>
          )}

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
              {loading ? 'Saving...' : editingChild ? 'Update Child' : 'Add Child'}
            </button>
            
            {editingChild && (
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

      {children?.length === 0 ? (
        <p>No children added yet. Add your first child to get started!</p>
      ) : (
        <div className={`bg-white rounded-lg shadow-md p-6 ${slideIn}`}>
          <h2 className="text-xl font-semibold mb-4">Your Children</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children?.map((child) => (
              <div
                key={child.id}
                className={`
                  p-4 border rounded-lg
                  hover:border-primary-500
                  ${transitions.default}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{child.firstName}</h3>
                    <p className="text-gray-600 text-sm">
                      Born: {new Date(child.birthYear, child.birthMonth - 1).toLocaleDateString('default', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(child)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(child.id)}
                      className="text-red-600 hover:text-red-700"
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
        </div>
      )}
    </div>
  );
};

export default FamilyConfig; 