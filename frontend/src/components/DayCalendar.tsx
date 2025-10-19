import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import type { Day } from '../types';

interface DayCalendarProps {
  days: Day[];
  onQuickAdd: (date: Date) => void;
  onDayClick: (day: Day) => void;
}

export const DayCalendar = ({ days, onQuickAdd, onDayClick }: DayCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Create a map of dates that have days for quick lookup
  const daysMap = new Map(
    days.map(day => [format(new Date(day.date), 'yyyy-MM-dd'), day])
  );

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingDay = daysMap.get(dateStr);

    if (existingDay) {
      onDayClick(existingDay);
    } else {
      onQuickAdd(date);
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const day = daysMap.get(dateStr);

    if (day) {
      return 'has-day';
    }
    return '';
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const day = daysMap.get(dateStr);

    if (day?.mood) {
      return <div className="day-mood">{day.mood}</div>;
    }
    return null;
  };

  return (
    <div className="day-calendar">
      {/* Counter Display */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center bg-gradient-to-br from-primary-500 to-pink-500 text-white rounded-2xl px-8 py-6 shadow-lg">
          <div>
            <div className="text-6xl font-bold">{days.length}</div>
            <div className="text-lg opacity-90 mt-1">Days Together</div>
          </div>
        </div>
      </div>

      <style>{`
        .day-calendar .react-calendar {
          width: 100%;
          border: none;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          padding: 1rem;
          font-family: inherit;
        }

        .day-calendar .react-calendar__tile {
          padding: 1rem 0.5rem;
          position: relative;
          min-height: 60px;
          border-radius: 0.375rem;
        }

        .day-calendar .react-calendar__tile:enabled:hover {
          background-color: #fce7f3;
          cursor: pointer;
        }

        .day-calendar .react-calendar__tile--active {
          background-color: #ec4899;
          color: white;
        }

        .day-calendar .react-calendar__tile.has-day {
          background-color: #fce7f3;
          font-weight: 600;
        }

        .day-calendar .react-calendar__tile.has-day:enabled:hover {
          background-color: #fbcfe8;
        }

        .day-calendar .day-mood {
          font-size: 1.25rem;
          margin-top: 0.25rem;
        }

        .day-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 1rem;
          font-weight: 600;
          color: #ec4899;
        }

        .day-calendar .react-calendar__navigation button:enabled:hover {
          background-color: #fce7f3;
        }

        .day-calendar .react-calendar__month-view__weekdays {
          font-weight: 600;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>

      <div className="mb-4 text-center">
        <p className="text-gray-700 font-medium">
          Click any day to count it! 💕
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Click marked days anytime to add details
        </p>
      </div>

      <Calendar
        value={selectedDate}
        onClickDay={handleDateClick}
        tileClassName={tileClassName}
        tileContent={tileContent}
        locale="en-US"
      />

      <div className="mt-4 flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-pink-100 border border-pink-200 rounded"></div>
          <span className="text-gray-600">Day together</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border border-gray-200 rounded"></div>
          <span className="text-gray-600">Click to add</span>
        </div>
      </div>
    </div>
  );
};
