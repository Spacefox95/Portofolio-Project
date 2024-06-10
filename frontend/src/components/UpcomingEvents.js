import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events', {
          withCredentials: true // Ensure cookies are sent with the request
        });
        setEvents(response.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchEvents();
  }, []);

  if (error) {
    return <div>Error fetching events: {error.message}</div>;
  }

  return (
    <div>
      <h1>Evenements à venir</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
              {event.summary}
            </a> - {new Date(event.start.dateTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UpcomingEvents;
