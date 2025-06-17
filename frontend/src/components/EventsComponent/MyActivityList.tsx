import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getUserID } from "../../util/auth";
import { Event } from "../../models/Event";
import { getGlobalFlag, setGlobalFlag, toggleGlobalFlag } from './globalFlag';

const MyActivityList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const userId = getUserID();
                const response = await fetch(`http://127.0.0.1:8000/users/${userId}/events-joined/`, {
                    method: "GET",
                    headers: {
                        Authorization: `token ${getAuthToken()}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
                const data = await response.json();
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                console.log(data);
                setEvents(data);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div>Loading events...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>My Activity List</h2>
            {events.map((event) => (
                <div
                    key={event.id}
                    style={styles.card}
                    onClick={() => {
                        toggleGlobalFlag();
                        navigate(`/events/${event.id}`, { state: event });
                    }}
                >
                    <h3 style={styles.title}>{event.name}</h3>
                    <p style={styles.location}>{event.location}</p>
                </div>
            ))}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "30px 40px",
        maxWidth: "800px",
        margin: "0 auto",
    },
    heading: {
        fontSize: "28px",
        color: "rgba(121,156,178,1)",
        marginBottom: "20px",
        textAlign: "center",
    },
    card: {
        backgroundColor: "rgba(50, 50, 50, 0.85)",
        color: "white",
        padding: "20px 25px",
        borderRadius: "10px",
        border: "1px solid rgba(121,156,178,0.6)",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        width: "100%",
    },
    title: {
        margin: 0,
        fontSize: "20px",
        color: "rgba(121,156,178,1)",
    },
    location: {
        marginTop: "8px",
        fontSize: "16px",
    },
};

export default MyActivityList;
