import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserID } from "../../util/auth";
import { User } from "../../models/User";
import { Event } from "../../models/Event";
import EventDetailsForm from "../EventsComponent/eventDetailsForm"; // adjust path

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleUpdateProfile = () => {
    navigate("/userUpdate");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserID();
        if (!userId) {
          console.error("User ID not found");
          return;
        }
        const response = await fetch(`http://127.0.0.1:8000/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data: User = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const userId = getUserID();
        if (!userId) {
          console.error("User ID not found");
          return;
        }
        const response = await fetch("http://127.0.0.1:8000/events/");
        if (!response.ok) throw new Error("Failed to fetch events");

        const allEvents: Event[] = await response.json();
        const filteredEvents = allEvents.filter(
          (event) => event.creator == userId
        );
        setUserEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchUserData();
    fetchEvents();
  }, []);

  if (!userData) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold mb-2">User Profile</h1>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow bg-white relative">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="mb-2"><strong>Username:</strong> {userData.username}</div>
      <div className="mb-2"><strong>Email:</strong> {userData.email}</div>
      <div className="mb-2"><strong>First Name:</strong> {userData.first_name}</div>
      <div className="mb-2"><strong>Last Name:</strong> {userData.last_name}</div>
      <div className="mb-2"><strong>Description:</strong> {userData.description}</div>
      <div className="mb-2"><strong>Rating:</strong> {userData.rating}</div>
      <div className="mb-2"><strong>Role:</strong> {userData.role}</div>
      <div className="mb-2">
        <strong>Date Joined:</strong> {new Date(userData.date_joined).toLocaleDateString()}
      </div>
      <div className="mb-2"><strong>Date of Birth:</strong> {userData.date_of_birth}</div>
      <div className="mb-2">
        <strong>Skills:</strong>{" "}
        {userData.skills.length > 0 ? userData.skills.join(", ") : "No skills listed"}
      </div>
      <div className="mb-2">
        <strong>Preferences:</strong>{" "}
        {userData.preferences.length > 0 ? userData.preferences.join(", ") : "No preferences listed"}
      </div>

      {/* Events Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">My Events</h2>
        {userEvents.length === 0 ? (
          <p>No events created by you.</p>
        ) : (
          <ul className="list-disc list-inside">
            {userEvents.map((event) => (
              <li key={event.id} className="mb-2">
                <span
                  onClick={() => openEventDetails(event)}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  <strong>{event.name}</strong> –{" "}
                  {new Date(event.starting_date).toLocaleDateString()}
                  <br />
                  <span className="text-gray-600">{event.location}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleUpdateProfile}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Update Profile
      </button>

      {/* Show the EventDetailsForm as a popup when selected */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-full max-w-md relative">
            <button
              onClick={closeEventDetails}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <EventDetailsForm eventDetail={selectedEvent} onClose={closeEventDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
