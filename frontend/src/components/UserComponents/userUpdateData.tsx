import React, { useState, useEffect } from "react";
import { User } from "../../models/User";
import { Skill } from "../../models/Skill";
import { Preference } from "../../models/Preference";
import { getUserID } from "../../util/auth";
import { useNavigate } from "react-router-dom";

const UserUpdate = () => {
    // User state
    const [user, setUser] = useState<User | null>(null);

    // All available skills/preferences
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [allPreferences, setAllPreferences] = useState<Preference[]>([]);

    // Selected skills and preferences by ID
    const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
    const [selectedPreferenceIds, setSelectedPreferenceIds] = useState<number[]>([]);

    // Popup visibility states
    const [showSkillsPopup, setShowSkillsPopup] = useState(false);
    const [showPreferencesPopup, setShowPreferencesPopup] = useState(false);

    // Editable user fields
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchSkills = async () => {
            const res = await fetch("http://127.0.0.1:8000/skills");
            const data: Skill[] = await res.json();
            setAllSkills(data);
            return data;
        };

        const fetchPreferences = async () => {
            const res = await fetch("http://127.0.0.1:8000/preferences");
            const data: Preference[] = await res.json();
            setAllPreferences(data);
            return data;
        };

        const fetchUser = async (skillsList: Skill[], preferencesList: Preference[]) => {
            const userId = getUserID();
            const res = await fetch(`http://127.0.0.1:8000/users/${userId}`);
            const data: User = await res.json();

            setUser(data);
            setUsername(data.username);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setDescription(data.description);

            const userSkillIds = data.skills
                .map((skillName: string) => {
                    const found = skillsList.find(s => s.name === skillName);
                    return found ? found.id! : undefined;
                })
                .filter((id): id is number => id !== undefined);

            setSelectedSkillIds(userSkillIds);

            const userPreferenceIds = data.preferences
                .map((prefName: string) => {
                    const found = preferencesList.find(p => p.name === prefName);
                    return found ? found.id! : undefined;
                })
                .filter((id): id is number => id !== undefined);

            setSelectedPreferenceIds(userPreferenceIds);
        };

        Promise.all([fetchSkills(), fetchPreferences()])
            .then(([skillsList, preferencesList]) => {
                fetchUser(skillsList, preferencesList);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const toggleSkill = (id: number) => {
        setSelectedSkillIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const togglePreference = (id: number) => {
        setSelectedPreferenceIds((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };
    // Inside your component
    const navigate = useNavigate();

    const handleSave = async () => {
        const updatedUserData = {
            username,
            first_name: firstName,
            last_name: lastName,
            description,
            skills: selectedSkillIds,
            preferences: selectedPreferenceIds,
        };

        try {
            const userId = getUserID();
            if (!userId) {
                console.error("User ID not found");
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            const data = await response.json();
            console.log("User updated successfully", data);

            // Navigate to user profile page after success
            navigate("/userDetail");  // Change this path to your actual user data view route

        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    if (!user) return <div>Loading user data...</div>;

    return (
        <div className="max-w-md mx-auto p-4 bg-white border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Update User Profile</h2>

            <label className="block mb-4">
                Username:<br />
                <input
                    type="text"
                    className="border p-1 w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>

            <label className="block mb-4">
                First Name:<br />
                <input
                    type="text"
                    className="border p-1 w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </label>

            <label className="block mb-4">
                Last Name:<br />
                <input
                    type="text"
                    className="border p-1 w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </label>

            <label className="block mb-4">
                Description:<br />
                <textarea
                    className="border p-1 w-full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <div className="mb-4">
                <strong>Skills:</strong>{" "}
                {selectedSkillIds.length > 0
                    ? allSkills
                        .filter((skill) => selectedSkillIds.includes(skill.id))
                        .map((skill) => skill.name)
                        .join(", ")
                    : "No skills selected"}
                <button
                    onClick={() => setShowSkillsPopup(true)}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                >
                    Edit Skills
                </button>
            </div>

            <div className="mb-4">
                <strong>Preferences:</strong>{" "}
                {selectedPreferenceIds.length > 0
                    ? allPreferences
                        .filter((pref) => selectedPreferenceIds.includes(pref.id))
                        .map((pref) => pref.name)
                        .join(", ")
                    : "No preferences selected"}
                <button
                    onClick={() => setShowPreferencesPopup(true)}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                >
                    Edit Preferences
                </button>
            </div>

            {/* Skills popup */}
            {showSkillsPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Select Skills</h3>
                        <div className="max-h-60 overflow-auto">
                            {allSkills.map((skill) => (
                                <label key={skill.id} className="block mb-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedSkillIds.includes(skill.id)}
                                        onChange={() => toggleSkill(skill.id)}
                                        className="mr-2"
                                    />
                                    {skill.name}
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowSkillsPopup(false)}
                            className="mt-4 px-4 py-2 bg-gray-300 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Preferences popup */}
            {showPreferencesPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Select Preferences</h3>
                        <div className="max-h-60 overflow-auto">
                            {allPreferences.map((pref) => (
                                <label key={pref.id} className="block mb-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedPreferenceIds.includes(pref.id)}
                                        onChange={() => togglePreference(pref.id)}
                                        className="mr-2"
                                    />
                                    {pref.name}
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowPreferencesPopup(false)}
                            className="mt-4 px-4 py-2 bg-gray-300 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={handleSave}
                className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Save Changes
            </button>
        </div>
    );
};

export default UserUpdate
