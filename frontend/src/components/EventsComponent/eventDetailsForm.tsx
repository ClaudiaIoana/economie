import { useState, useEffect, CSSProperties } from "react";
import { Preference } from "../../models/Preference";
import { User } from "../../models/User";

import { getAuthToken, getUserID } from "../../util/auth";
import { Skill } from "../../models/Skill.ts";
import Popup from "./PopUp.tsx";
import DeleteEvent from "./deleteEvent.tsx";
import UpdateEventForm from "./updateEventForm.tsx";
import { useLocation } from "react-router-dom";
import ParticipantRatingPopup from "./ParticipantRating.tsx";
import { getGlobalFlag, setGlobalFlag, toggleGlobalFlag } from '../EventsComponent/globalFlag';


const EventDetailsForm = () => {
    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [desiredCommand, setDesiredCommand] = useState(-1);
    const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);

    const [participants, setParticipants] = useState<any[]>([]);
    const [isParticipantPopupOpen, setParticipantPopupOpen] = useState(false);
    const [creatorData, setCreatorData] = useState<User>();



    const { state: event } = useLocation();


    const openDeletePopup = () => {
        setDeletePopupOpen(true);
    };

    const closeDeletePopup = () => {
        setDeletePopupOpen(false);
    };


    const fetchParticipants = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/events/${event.id}/participants/`, {
                headers: {
                    'Authorization': `Token ${getAuthToken()}`,
                },
            });
            const data = await res.json();
            setParticipants(data);
            setParticipantPopupOpen(true);
        } catch (err) {
            console.error('Error fetching participants:', err);
        }
    };


    const handleJoinEvent = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/events/${event.id}/join/`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert("You successfully joined the event!");
            } else {
                alert("Failed to join event.");
            }
        } catch (error) {
            console.error("Join error:", error);
            alert("An error occurred while joining.");
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/preferences/?format=json",
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                const data = await response.json();
                setPreferences(data);
                ///////////////////////////////////////////////
                const response2 = await fetch(
                    "http://127.0.0.1:8000/skills/?format=json",
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                const data2 = await response2.json();
                setSkills(data2);
                //////////////////////////////////////////////////////

                const response3 = await fetch(
                    `http://127.0.0.1:8000/users/${event.creator}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `token ${getAuthToken()}`, // if you're using token auth
                            'Content-Type': 'application/json',         // optional for GET, but useful for other methods
                            // Add any other custom headers here
                        }
                    }
                );
                const data3 = await response3.json();
                setCreatorData(data3);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const currentPreferencesSet = new Set();
    const currentSkillsSet = new Set();

    event.preferences.forEach((item: number) => {

        if (preferences && preferences[item - 1] && preferences[item - 1].name) {
            currentPreferencesSet.add(preferences[item - 1].name);
        } else {
            console.error(
                `Invalid index or missing 'name' property for preference at index ${item}`
            );
        }
    });

    event.skills.forEach((item: number) => {
        if (skills && skills[item - 1] && skills[item - 1].name) {
            currentSkillsSet.add(skills[item - 1].name);
        } else {
            console.error(
                `Invalid index or missing 'name' property for skill at index ${item}`
            );
        }
    });
    const currentPreferences = Array.from(currentPreferencesSet);
    const currentSkills = Array.from(currentSkillsSet);
    useEffect(() => {
        if (!creatorData) return; // wait until creatorData is available

        setFormData({
            name: event.name,
            description: event.description,
            starting_date: event.starting_date,
            ending_date: event.ending_date,
            creator: creatorData.username,
            capacity: event.capacity,
            rating: event.rating,
            location: event.location,
            preferences: event.preferences,
            skills: event.skills,

        });
    }, [event, creatorData]); // ← include creatorData as a dependency

    useEffect(() => {
        const eventPreferences = preferences.filter(
            (preference) =>
                event.preferences.indexOf(preference.id) > -1
        );
        setPreferenceNames([]);
        eventPreferences.forEach((preference) =>
            setPreferenceNames((preferenceArr) => [
                ...preferenceArr,
                preference.name,
            ])
        );
    }, [preferences]);


    useEffect(() => {
        const eventSkills = skills.filter(
            (skill) =>
                event.skills.indexOf(skill.id) > -1
        );
        setSkillNames([]);
        eventSkills.forEach((skill) =>
            setSkillNames((skillArr) => [
                ...skillArr,
                skill.name,
            ])
        );
    }, [skills]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        starting_date: "",
        ending_date: "",
        creator: "",
        capacity: "",
        rating: "",
        location: "",
        preferences: "",
        skills: "",

    });

    const [userRating, setUserRating] = useState<number>(0);

    const submitRating = async () => {
        if (userRating < 1 || userRating > 5) {
            alert("Please select a rating between 1 and 5");
            return;
        }
        try {
            const res = await fetch(`http://127.0.0.1:8000/events/${event.id}/rate/?rate=${userRating}`, {
                method: "POST",
                headers: {
                    "Authorization": `token ${getAuthToken()}`,
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                alert("Thank you for rating the event!");
                setUserRating(0);
                // Optionally, refresh event details here to get updated average_rating
            } else {
                alert("Failed to rate event.");
            }
        } catch (e) {
            console.error(e);
            alert("Error rating event.");
        }
    };


    const [preferenceNames, setPreferenceNames] = useState<string[]>([]);
    const [skillNames, setSkillNames] = useState<string[]>([]);

    const handleExitDetail = () => {
        toggleGlobalFlag();
        const isUserEventPage = window.location.href.includes("/userEvents");
        const isUserDetailPage = window.location.href.includes("/userDetail");
        if (isUserEventPage) {
            window.location.href = `/userEvents/`;
        } else if (isUserDetailPage) {
            window.location.href = `/userDetail/`;
        } else {
            window.location.href = `/showlist/`;
        }
    };
    const handleCancel = () => {
        setDesiredCommand(-1);
    };
    return (
        <div style={styles.overlay}>
            <div style={styles.modal} modal-class="modal-fullscreen">
                <div style={styles.header}>
                    <button
                        style={styles.exitButton}
                        onClick={handleExitDetail}
                    >
                        Exit
                    </button>
                </div>

                <h1>{event.name}</h1>
                {/* {formData.photo && (
                    <div>
                        <img src={formData.photo} alt="My Image" />
                    </div>
                )} */}

                <div style={styles.preferencesAndPhotoContainer}>
                    <div style={styles.infoContainer}>
                        <h2>Event Information: </h2>
                        <p>
                            <b>
                                {"Description: ".concat(
                                    String(formData.description)
                                )}
                            </b>
                        </p>
                        <p>
                            <b>
                                {"Starting date: ".concat(
                                    String(formData.starting_date)
                                )}
                            </b>
                        </p>
                        <p>
                            <b>
                                {"Ending date: ".concat(
                                    String(formData.ending_date)
                                )}
                            </b>
                        </p>
                        <p>
                            <b>
                                {"Creator: ".concat(formData.creator)}
                            </b>
                        </p>
                        <p>
                            <b>
                                {"Capacity: ".concat(
                                    String(formData.capacity)
                                )}
                            </b>
                        </p>
                        <p>
                            <b>
                                {"Location: ".concat(
                                    String(formData.location)
                                )}{" "}
                            </b>
                        </p>
                        <p>
                            <b>
                                {"Rating: ".concat(
                                    String(formData.rating)
                                )}
                            </b>
                        </p>
                    </div>
                    <div style={styles.preferencesContainer}>
                        <h2>Preferences:</h2>
                        <ul>

                            {currentPreferences.map((preference, index) => (
                                <li key={index}>{preference}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={styles.preferencesContainer}>
                        <h2>Skills:</h2>
                        <ul>
                            {currentSkills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div style={styles.descriptionContainer}>
                    {event.description}
                </div>

                <div id="buttons-container">
                    {String(event.creator) === String(getUserID()) ? (
                        <div>
                            <button
                                style={styles.inputButton}
                                onClick={() => {
                                    setDesiredCommand(0);
                                    openDeletePopup();
                                }}
                            >
                                Delete
                            </button>
                            <button
                                style={styles.inputButton}
                                onClick={() => {
                                    setDesiredCommand(1);
                                }}
                            >
                                Update
                            </button>
                            <button style={styles.inputButton} onClick={fetchParticipants}>
                                View Participants / Rate
                            </button>

                            {isParticipantPopupOpen && (
                                <ParticipantRatingPopup
                                    participants={participants}
                                    eventId={event.id}
                                    onClose={() => setParticipantPopupOpen(false)}
                                />
                            )}
                        </div>
                    ) : (

                        <div id="buttons-container">
                            {String(event.creator) === String(getUserID()) ? (
                                // creator buttons ...
                                <>
                                    <button style={styles.inputButton} onClick={fetchParticipants}>
                                        View Participants / Rate
                                    </button>

                                    {isParticipantPopupOpen && (
                                        <ParticipantRatingPopup
                                            participants={participants}
                                            eventId={event.id}
                                            onClose={() => setParticipantPopupOpen(false)}
                                        />
                                    )}
                                </>
                            ) : (
                                <>{getGlobalFlag() == false &&
                                    <button
                                        style={styles.inputButton}
                                        onClick={async () => {
                                            const response = await fetch(`http://127.0.0.1:8000/events/${event.id}/join/`, {
                                                method: "POST",
                                                headers: {
                                                    "Authorization": `token ${getAuthToken()}`,
                                                    "Content-Type": "application/json",
                                                },
                                            });

                                            if (response.ok) {
                                                alert("You have joined the event!");
                                            } else {
                                                alert("Failed to join event.");
                                            }
                                        }}
                                    >
                                        Join Event
                                    </button>}

                                    {getGlobalFlag() == true && <div style={{ marginBottom: "20px" }}>
                                        <label style={{ marginRight: 10 }}>Rate this event:</label>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                style={{
                                                    cursor: "pointer",
                                                    color: star <= userRating ? "#f5a623" : "#ccc",
                                                    fontSize: "24px",
                                                    marginRight: 5,
                                                }}
                                                onClick={() => setUserRating(star)}
                                            >
                                                ★
                                            </span>
                                        ))}
                                        <button
                                            style={{
                                                marginLeft: 10,
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                            }}
                                            onClick={submitRating}
                                        >
                                            Submit Rating
                                        </button>
                                    </div>}
                                </>
                            )}

                            {/* Delete and Update popups */}
                            {desiredCommand === 0 && isDeletePopupOpen && (
                                <DeleteEvent eventToDelete={event} />
                            )}
                            {desiredCommand === 1 && <UpdateEventForm eventToUpdate={event} />}
                        </div>


                    )}

                    {desiredCommand === 0 && isDeletePopupOpen && (
                        <DeleteEvent eventToDelete={event} />
                    )}
                    {desiredCommand === 1 && (
                        <UpdateEventForm eventToUpdate={event} />
                    )}

                </div>

            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        background: "#fff",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        width: "90%",
        maxWidth: "1000px",
        maxHeight: "90%",
        overflowY: "auto",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#333",
    },
    header: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px",
    },
    exitButton: {
        backgroundColor: "#dc3545",
        border: "none",
        color: "#fff",
        fontSize: "16px",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "0.3s",
    },
    title: {
        textAlign: "center",
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#333",
    },
    preferencesAndPhotoContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        marginBottom: "20px",
    },
    infoContainer: {
        flex: 1,
        minWidth: "300px",
    },
    preferencesContainer: {
        flex: 1,
        minWidth: "200px",
    },
    descriptionContainer: {
        background: "#333",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px",
        marginBottom: "20px",
    },
    inputButton: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "#fff",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "10px",
        transition: "0.2s",
    },
    buttonContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "15px",
        marginTop: "30px",
    },
};
export default EventDetailsForm;