import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { fetchEvents } from '../../store/thunks/eventThunks';
import { fetchChildren } from '../../store/thunks/familyThunks';
import EventList from '../Events/EventList';
import PointsChart from '../Charts/PointsChart';
import Card from '../common/Card';
import Button from '../common/Button';
import { fadeIn, slideIn } from '../../utils/animations';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { children } = useSelector((state: RootState) => state.family);
    const { events } = useSelector((state: RootState) => state.events);
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const promises = [];
                if (events.length === 0) promises.push(dispatch(fetchEvents()));
                if (children.length === 0) promises.push(dispatch(fetchChildren()));
                if (promises.length > 0) {
                    await Promise.all(promises);
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [dispatch, events.length, children.length]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 ${fadeIn}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome, {user?.firstName}!
                </h1>
                <div className="flex flex-wrap gap-4">
                    <Button
                        as={Link}
                        to="/events/categories"
                        variant="secondary"
                        size="md"
                        className={slideIn}
                    >
                        Manage Categories
                    </Button>
                    <Button
                        as={Link}
                        to="/events/new"
                        variant="primary"
                        size="md"
                        className={slideIn}
                    >
                        Add New Event
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className={`p-6 ${slideIn} delay-100`}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Points Overview</h2>
                    <PointsChart data={events} />
                </Card>

                <Card className={`p-6 ${slideIn} delay-200`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
                        <Button
                            as={Link}
                            to="/events"
                            variant="text"
                            size="sm"
                        >
                            View All
                        </Button>
                    </div>
                    <EventList events={events.slice(0, 5)} />
                </Card>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Children</h2>
                    <Button
                        as={Link}
                        to="/family/config"
                        variant="text"
                        size="sm"
                    >
                        Manage Family
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {children.map((child, index) => (
                        <Link
                            key={child.id}
                            to={`/child/${child.id}`}
                            className={`${slideIn} delay-${(index + 3) * 100}`}
                        >
                            <Card
                                className={`
                                    p-6 hover:shadow-lg
                                    transform transition-all duration-200
                                    hover:-translate-y-1 cursor-pointer
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {child.firstName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Born: {child.birthMonth}/{child.birthYear}
                                        </p>
                                    </div>
                                    <div className="text-primary-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 