import {Event} from "../../models/Event";
import React, {useState, useEffect, CSSProperties} from "react";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import EventDetailsForm from "./eventDetailsForm.tsx";
import AddEventForm from "./addEventForm.tsx";
import {FaSearch} from "react-icons/fa";
import {VscAccount} from "react-icons/vsc";
import {getAuthToken, getUserID} from "../../util/auth.tsx";

const EventList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState(-1);
    const [desiredCommand, setDesiredCommand] = useState(0);

    const [filterName, setFilterName] = useState("");
    const [filterStartingDate, setFilterStartingDate] = useState("");
    const [filterEndingDate, setFilterEndingDate] = useState("");
    const [filterCreator, setFilterCreator] = useState("");
    const [filterCapacity, setFilterCapacity] = useState("");
    const [filterLocation, setFilterLocation] = useState("");

    const [showFilterModalName, setShowFilterModalName] = useState(false);
    const isAnyFilterModalOpen = showFilterModalName;
    const [showUserMenu, setShowUserMenu] = useState(false);
    let [filters, setFilters] = useState("");

    const [viewOption, setViewOption] = useState<"matching" | "all">("matching");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response2 = await fetch(
                    `http://127.0.0.1:8000/events/?${filters}&format=json`,
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
                setAllEvents(data2);

                const response = await fetch(
                    `http://127.0.0.1:8000/events/?${filters}&format=json`,
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
                setEvents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [filters]); // 👈 now it listens for filter and page changes

    const [skillUserList, setskillUserList] = useState([]);

    useEffect(() => {
        const fetchSkillEvents = async () => {
            const response = await fetch(`http://127.0.0.1:8000/skills/user/${getUserID()}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data)
            setskillUserList(data);
            console.log(skillUserList)
        };

        fetchSkillEvents();
    }, []);

    const handleDeleteFilters = () => {
        setFilterName("");
        setFilterStartingDate("");
        setFilterEndingDate("");
        setFilterCapacity("");
        setFilterCreator("");
        setFilterLocation("");
        setFilters("");
    };

    const handleFilterSubmit = async () => {
        const f = new URLSearchParams();
        if (filterName) f.append("name", filterName);
        if (filterStartingDate) f.append("starting_date", filterStartingDate);
        if (filterEndingDate) f.append("ending_date", filterEndingDate);
        if (filterCreator) f.append("creator", filterCreator);
        if (filterCapacity) f.append("capacity", filterCapacity);
        if (filterLocation) f.append("location", filterLocation);

        const newFilters = f.toString();
        setFilters(newFilters);
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(e.target.value);
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.searchContainer}>
                <form style={styles.searchContainer} onSubmit={(e) => {
                    e.preventDefault();
                    handleFilterSubmit();
                }}>
                    <div>
                        <input
                            type="text"
                            placeholder="Search events by name..."
                            value={filterName}
                            onChange={handleSearchChange}
                            style={styles.searchInput}
                        />
                        <button
                            onClick={() => setViewOption("matching")}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: viewOption === "matching" ? "rgba(121, 156, 178, 1)" : "rgba(107, 107, 107, 0.8)",
                                border: "1px solid ",
                                borderRadius: "14px",
                                cursor: "pointer",
                                marginLeft: "300px"
                            }}
                        >
                            Matching Events
                        </button>
                        <button
                            onClick={() => setViewOption("all")}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: viewOption === "all" ? "rgba(121, 156, 178, 1)" : "rgba(107, 107, 107, 0.8)",
                                border: "0px solid ",
                                borderRadius: "14px",
                                cursor: "pointer",
                                marginLeft: "20px"
                            }}
                        >
                            All Events
                        </button>
                    </div>
                    <button style={styles.searchIconButton} onClick={() => {
                        setShowFilterModalName(true);
                    }}>
                        <FaSearch/>
                    </button>
                    <div style={styles.userIconWrapper}>
                        <button style={styles.userIconButton} onClick={() => setShowUserMenu((prev) => !prev)}>
                            <VscAccount/>
                        </button>
                        {showUserMenu && (
                            <div style={styles.userMenu}>
                                <Link to="/userDetail">
                                    <button style={styles.userMenuItem}>Profile</button>
                                </Link>
                                <Link to="/logout">
                                    <button style={styles.userMenuItem}>Logout</button>
                                </Link>
                                <Link to="/donate">
                                    <button style={styles.userMenuItem}>Donate</button>
                                </Link>
                            </div>
                        )}
                    </div>

                </form>


            </div>

            {viewOption === "matching" ? (
                <div style={{marginTop: "120px"}}>
                    <h2 style={{fontSize: "24px", marginBottom: "10px"}}>Your Skills & Matching Events</h2>
                    {skillUserList.map((entry: any) => {
                        if (!entry) return null;
                        return (
                            <div key={entry.skill.id} style={{marginBottom: "30px"}}>
                                <h3 style={{fontSize: "20px", color: "rgba(121, 156, 178, 1)"}}>
                                    {entry.skill.name}
                                </h3>
                                {entry.events && entry.events.length > 0 ? (
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: "20px",
                                        marginTop: "30px"
                                    }}>
                                        {entry.events.map((event: Event, index: number) => {
                                            const first50Words = event.description
                                                ?.split(' ')
                                                .slice(0, 20)
                                                .join(' ') + '...';

                                            return (
                                                <div
                                                    key={event.id}
                                                    style={{
                                                        ...styles.listItem,
                                                        minHeight: "200px",
                                                        padding: "20px",
                                                        fontSize: "16px",
                                                        ...(index % 2 === 0 ? styles.evenItem : styles.oddItem),
                                                    }}
                                                >
                                                    <div className="title" style={{
                                                        marginBottom: "10px",
                                                        fontWeight: "bold",
                                                        fontSize: "18px"
                                                    }}>
                                                        {event.name}
                                                    </div>

                                                    <div style={{marginBottom: "15px", color: "#444"}}>
                                                        {first50Words}
                                                    </div>
                                                    <div>
                                                        Location: {event.location}
                                                    </div>

                                                    <button
                                                        style={{
                                                            ...styles.button,
                                                            ...(index % 2 === 0 ? styles.whiteButton : styles.yellowButton),
                                                        }}
                                                        onClick={() =>
                                                            navigate(`/events/${event.id}`, {state: event})
                                                        }
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{fontStyle: "italic"}}>No events available for this skill.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "100px"}}>
                    {events.map((event, index) => (

                        <div
                            key={event.id}
                            style={{
                                ...styles.listItem,
                                ...(index % 2 === 0 ? styles.evenItem : styles.oddItem),
                            }}
                        >
                            <div className="title" style={{
                                marginBottom: "10px",
                                fontWeight: "bold",
                                fontSize: "18px"
                            }}>
                                {event.name}
                            </div>

                            <div style={{marginBottom: "15px", color: "#444"}}>
                                {event.description
                                    ?.split(' ')
                                    .slice(0, 20)
                                    .join(' ') + '...'}
                            </div>

                            <div>
                                Location: {event.location}
                            </div>

                            <button
                                style={{
                                    ...styles.button,
                                    ...(index % 2 === 0 ? styles.whiteButton : styles.yellowButton),
                                }}
                                onClick={() => navigate(`/events/${event.id}`, {state: event})}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}


            {isAnyFilterModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Filter Events</h3>

                        <label>
                            Name:
                            <input
                                type="text"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </label>
                        <label>
                            Creator:
                            <input
                                type="text"
                                value={filterCreator}
                                onChange={(e) => setFilterCreator(e.target.value)}
                            />
                        </label>
                        <label>
                            Starting Date:
                            <input
                                type="date"
                                value={filterStartingDate}
                                onChange={(e) => setFilterStartingDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Ending Date:
                            <input
                                type="date"
                                value={filterEndingDate}
                                onChange={(e) => setFilterEndingDate(e.target.value)}
                            />
                        </label>
                        <label>
                            Capacity:
                            <input
                                type="number"
                                value={filterCapacity}
                                onChange={(e) => setFilterCapacity(e.target.value)}
                            />
                        </label>
                        <label>
                            Location:
                            <input
                                type="text"
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                            />
                        </label>

                        <div style={{marginTop: '10px'}}>
                            <button
                                style={styles.inputButton}
                                onClick={() => {
                                    handleFilterSubmit();
                                    setShowFilterModalName(false);
                                }}
                            >
                                Apply Filters
                            </button>
                            <button
                                style={{...styles.inputButton, marginLeft: '10px'}}
                                onClick={() => setShowFilterModalName(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p></p>
            {isAnyFilterModalOpen && (
                <button style={styles.inputButton} onClick={handleFilterSubmit}>
                    Submit Filters
                </button>
            )}
            {isAnyFilterModalOpen && (
                <button
                    style={styles.inputButton}
                    onClick={handleDeleteFilters}
                >
                    Delete Filters
                </button>
            )}

        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    pageWrapper: {
        padding: "20px",
    },

    searchContainer: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "#2d2d2d", // transparent look
        backdropFilter: "blur(8px)", // optional frosted effect
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(200, 200, 200, 0.3)",
    },

    searchInput: {
        width: "35%",
        padding: "10px 40px 10px 10px", // leave space for icon on the right
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        marginBottom: "20px",
        marginLeft: "300px",
    },

    searchIconButton: {
        position: "absolute",
        left: "950px",
        top: "30px",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
    },

    eventsContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
    },

    listItem: {
        width: "400px",
        border: "1px solid ",
        borderRadius: "5px",
        padding: "15px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
    },
    evenItem: {
        backgroundColor: "#A3C1D9",
        color: "black",
    },
    oddItem: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "black",
    },
    button: {
        marginTop: "15px",
        padding: "8px 12px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    whiteButton: {
        backgroundColor: "#A3C1D9",
        color: "#ffffff",
    },
    yellowButton: {
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "#ffffff",
    },
    inputButton: {
        padding: "10px 20px",
        borderRadius: "10px",
        backgroundColor: "rgba(121, 156, 178, 1)",
        color: "white",
        border: "none",
        cursor: "pointer"
    },
    buttonContainer: {
        display: "flex",
        alignItems: "center",
        marginTop: "20px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: "#333",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },

    userIconWrapper: {
        position: "absolute",
        border: "none",
        top: "20px",
        right: "20px",
    },

    userIconButton: {
        background: "transparent",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
    },

    userMenu: {
        position: "absolute",
        top: "40px",
        right: "0",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderRadius: "8px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
    },

    userMenuItem: {
        background: "none",
        border: "none",
        padding: "8px 12px",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        color: "#333",
    },
};

export default EventList;
