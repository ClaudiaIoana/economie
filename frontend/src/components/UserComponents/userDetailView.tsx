import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUserID } from "../../util/auth";
import { User } from "../../models/User";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserID();
        if (!userId) {
          console.error("User ID not found");
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:8000/users/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data: User = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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
    <div className="p-4 max-w-md mx-auto border rounded shadow bg-white">
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
        <strong>Skills:</strong> {userData.skills.length > 0 ? userData.skills.join(", ") : "No skills listed"}
      </div>
      <div className="mb-2">
        <strong>Preferences:</strong> {userData.preferences.length > 0 ? userData.preferences.join(", ") : "No preferences listed"}
      </div>

      <button
        onClick={handleUpdateProfile}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Update Profile
      </button>

      <Link
        to="/update-profile"
        className="mt-2 block text-blue-500 hover:underline"
      >
        Go to Update Profile page (via Link)
      </Link>
    </div>
  );
};

export default UserProfile;
