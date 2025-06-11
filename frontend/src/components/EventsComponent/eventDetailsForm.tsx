import { useState, useEffect, CSSProperties } from "react";
import { Preference } from "../../models/Preference";

import { getUserID } from "../../util/auth";
import { prototypejs } from "globals";
import { Skill } from "../../models/Skill.ts";
import Popup from "./PopUp.tsx";
import DeleteEvent from "./deleteEvent.tsx";
import UpdateEventForm from "./updateEventForm.tsx";


const EventDetailsForm = (props: { eventDetail: any; onClose: () => void }) => {
    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [desiredCommand, setDesiredCommand] = useState(-1);
    console.log(props.eventDetail.creator);
    console.log(props.eventDetail.creator);
    const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);

    const openDeletePopup = () => {
        setDeletePopupOpen(true);
    };

    const closeDeletePopup = () => {
        setDeletePopupOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/preferences/?format=json"
                );
                const data = await response.json();
                setPreferences(data);
                const response2 = await fetch(
                    "http://127.0.0.1:8000/skills/?format=json"
                );
                const data2 = await response2.json();
                setSkills(data2);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const currentPreferencesSet = new Set();
    const currentSkillsSet = new Set();
    props.eventDetail.preferences.forEach((item: number) => {
        // Ensure 'preferences' array is defined and item is a valid index
        if (preferences && preferences[item - 1] && preferences[item - 1].name) {
            currentPreferencesSet.add(preferences[item - 1].name);
        } else {
            console.error(
                `Invalid index or missing 'name' property for preference at index ${item}`
            );
        }
    });

    props.eventDetail.skills.forEach((item: number) => {
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
        setFormData({
            name: props.eventDetail.name,
            description: props.eventDetail.description,
            starting_date: props.eventDetail.starting_date,
            ending_date: props.eventDetail.ending_date,
            creator: props.eventDetail.creator,
            capacity: props.eventDetail.capacity,
            location: props.eventDetail.location,
            preferences: props.eventDetail.preferences,
            skills: props.eventDetail.skills
        });
        console.log(props.eventDetail?.photo);
        console.log("cvbhnjkl;");
    }, [props.eventDetail]);

    useEffect(() => {
        const eventPreferences = preferences.filter(
            (preference) =>
                props.eventDetail.preferences.indexOf(preference.id) > -1
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
        const eventPreferences = skills.filter(
            (skill) =>
                props.eventDetail.skills.indexOf(skill.id) > -1
        );
        setSkillNames([]);
        eventPreferences.forEach((skill) =>
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
        location: "",
        preferences: "",
        skills: ""
    });

    const [preferenceNames, setPreferenceNames] = useState<string[]>([]);
    const [skillNames, setSkillNames] = useState<string[]>([]);

    const handleExitDetail = () => {
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

                <h1>{props.eventDetail.name}</h1>
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
                    {props.eventDetail.description}
                </div>

                <div id="buttons-container">
                    {props.eventDetail.creator == getUserID() && (
                        <div>
                            {" "}
                            <td>
                                {/* <Link to={`/delete-event`}> */}
                                <button
                                    style={styles.inputButton}
                                    onClick={() => {
                                        setDesiredCommand(0);
                                        openDeletePopup();
                                    }}
                                >
                                    Delete
                                </button>
                                {/* </Link> */}
                            </td>
                            <td>
                                <button
                                    style={styles.inputButton}
                                    onClick={() => {
                                        setDesiredCommand(1);
                                    }}
                                >
                                    Update
                                </button>
                            </td>
                        </div>
                    )}
                    {desiredCommand === 0 && isDeletePopupOpen && (
                        <Popup
                            isOpen={isDeletePopupOpen}
                            onClose={closeDeletePopup}
                        >
                            <DeleteEvent eventToDelete={props.eventDetail} />
                        </Popup>
                    )}
                    {desiredCommand === 1 && (
                        <UpdateEventForm eventToUpdate={props.eventDetail} />
                    )}

                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    title: {
        alignItems: "center",
        background: "#ecb753",
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        background: "rgba(236, 183, 83, 0.8)", // Adjust the alpha value to control transparencyyyy
    },
    modal: {
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        textAlign: "left",
        width: "80%", // Set the width as needed
        height: "80%", // Set the height as needed
        overflow: "auto", // Add scrollbar if content exceeds the available space
        boxSizing: "border-box",
    },
    form: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
    },
    label: {
        marginBottom: 10,
        textAlign: "center",
    },
    button: {
        padding: "10px",
        marginTop: "10px",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },

    exitButton: {
        backgroundColor: "red",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        fontSize: "16px",
    },

    content: {
        overflow: "auto", // Add scrollbar if content exceeds the available space
        maxHeight: "calc(100% - 40px)", // Set the maximum height, considering header and padding
    },
    generic: {
        color: "white",
    },
    inputButton: {
        backgroundColor: "#ecb753", // Dark yellow button color
        color: "#333333", // Dark gray text color
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginRight: "20px",
        marginLeft: "20px",
    },

    preferencesAndPhotoContainer: {
        display: "flex",
        //flexDirection: "column", // Display children in a column
        alignItems: "flex-start", // Align items to the start of the cross axis
        justifyContent: "space-evenly",
    },
    preferencesContainer: {
        marginBottom: "20px", // Add margin between preferences and photo
    },
    photoContainer: {
        alignSelf: "flex-start", // Align photo to the start of the cross axis
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
    },
    descriptionContainer: {
        marginRight: "40px",
        marginLeft: "40px",
        marginBottom: "40px",
        marginTop: "40px",
    },
};

export default EventDetailsForm;