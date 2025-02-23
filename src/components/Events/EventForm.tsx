import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AppDispatch, RootState } from '../../store';
import { createEvent } from '../../store/thunks/eventThunks';
import { fetchCategories } from '../../store/thunks/eventThunks';
import { fadeIn, transitions } from '../../utils/animations';

interface EventFormData {
  childId: string;
  categoryId: string;
  eventDate: Date;  // Use Date for form state
  eventType: 'Good' | 'Bad';
  notes: string;
  points: number;
}

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { children } = useSelector((state: RootState) => state.family);
  const { categories } = useSelector((state: RootState) => state.events);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    childId: '',
    categoryId: '',
    eventDate: new Date(),
    eventType: 'Good',
    notes: '',
    points: 0
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      setFormData({
        ...formData,
        categoryId,
        eventType: selectedCategory.type,
        points: selectedCategory.points
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createEvent({
        ...formData,
        eventDate: formData.eventDate.toISOString()
      })).unwrap();
      navigate('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  return (
    <div className={`max-w-2xl mx-auto p-4 ${fadeIn}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
        <p className="mt-2 text-gray-600">Record a new behavior event for your child.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Child</label>
          <select
            value={formData.childId}
            onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="">Select a child</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.points} points)
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Event Type:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                selectedCategory.type === 'Good' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedCategory.type}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Points:</span>
              <span className="font-medium text-gray-900">{selectedCategory.points}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <DatePicker
            selected={formData.eventDate}
            onChange={(date: Date | null) => {
              if (date) {
                setFormData({ ...formData, eventDate: date });
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            maxDate={new Date()}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            rows={3}
            placeholder="Add any additional notes about this event..."
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
            {loading ? 'Adding Event...' : 'Add Event'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 