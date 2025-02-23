import React from 'react';
import { Event } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { transitions, fadeIn } from '../../utils/animations';

interface EventListProps {
    events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
    return (
        <div className={`space-y-4 ${fadeIn}`}>
            {events.map((event, index) => (
                <div
                    key={event.id}
                    className={`
                        ${transitions.default}
                        p-4 rounded-lg border border-gray-200
                        hover:border-primary-200 hover:bg-primary-50
                        animate-[slideIn_0.3s_ease-in-out]
                        animation-delay-${index * 100}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900">
                                    {event.child?.firstName}
                                </h3>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600">
                                    {event.category?.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{formatDate(event.eventDate)}</span>
                                {event.notes && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <span className="italic">{event.notes}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span
                                className={`
                                    ${transitions.default}
                                    px-3 py-1 rounded-full text-sm font-medium
                                    ${event.eventType === 'Good'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }
                                `}
                            >
                                {event.eventType === 'Good' ? '+' : '-'}{event.points}
                            </span>
                            <span className={`
                                text-xs font-medium px-2 py-0.5 rounded
                                ${event.eventType === 'Good'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }
                            `}>
                                {event.eventType}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventList; 