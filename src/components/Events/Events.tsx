import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { fetchEvents } from '../../store/thunks/eventThunks';
import EventList from './EventList';
import Button from '../common/Button';
import { fadeIn, slideIn } from '../../utils/animations';

const Events: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { events, loading } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    // Always fetch events when component mounts or location changes
    dispatch(fetchEvents());
  }, [dispatch, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${fadeIn}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Events History</h1>
        <div className="flex gap-4">
          <Button
            as={Link}
            to="/events/categories"
            variant="secondary"
            className={slideIn}
          >
            Manage Categories
          </Button>
          <Button
            as={Link}
            to="/events/new"
            variant="primary"
            className={slideIn}
          >
            Add New Event
          </Button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No events recorded yet.</p>
          <div className="space-x-4">
            <Link
              to="/events/categories"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Set up event categories
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/events/new"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Record your first event
            </Link>
          </div>
        </div>
      ) : (
        <EventList events={events} />
      )}
    </div>
  );
};

export default Events; 