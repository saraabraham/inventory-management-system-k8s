import React, { useState } from "react";
import '../styles/Resource.css';
import MoreResource from "./MoreResource";
import DropDown from "./DropDown";
import DropDown1 from "./DropDown1";
import Footer from "./Footer";


const Resource = ({ icons }) => {
    const [country, setCountry] = useState("");
    const [uni, setUni] = useState("");
    const [job, setJob] = useState("");
    const [agency, setAgency] = useState("");
    const [hr, setHR] = useState("");
    const [program, setProgram] = useState("");
    const [course, setCourse] = useState("");
    const [support, setSupport] = useState("");
    const [studentUnion, setStudentUnion] = useState("");



    return (
        <div className="resource">
            <div className="resource1">
                <h2>Get in Touch with Career Resources</h2>
                <h3>Explore opportunities and support in your region</h3>


                <div className="dropdown1-container">
                    <label className="dropDown-label">
                        Select a country
                    </label>
                    <DropDown1
                        label="Select Country"
                        options={["Sweden", "Denmark", "Portugal"]}
                        value={country}          // your state variable
                        onChange={setCountry}    // state updater
                    />
                </div>

                <div className="dropdown-wrapper1">
                    <div className="dropdown2-container1">

                        <DropDown
                            label="Universities"
                            options={["Uni A", "Uni B"]}
                            icon={icons.uniIcon}
                            value={uni}
                            onChange={setUni}
                        />

                        <DropDown
                            label="Job Portals"
                            options={["Job A", "Job B"]}
                            icon={icons.jobIcon}
                            value={job}
                            onChange={setJob}
                        />
                        <DropDown
                            label="Agencies"
                            options={["Agency A", "Agency B"]}
                            icon={icons.agencyIcon}
                            value={agency}
                            onChange={setAgency}
                        />

                        <DropDown
                            label="HR Companies"
                            options={["HR A", "HR B"]}
                            icon={icons.hrIcon}
                            value={hr}
                            onChange={setHR}
                        />
                    </div>

                    <div className="dropdown2-container2">
                        {/* Programs */}

                        <DropDown
                            label="Programs"
                            options={["Program A", "Program B"]}
                            icon={icons.programIcon}
                            value={program}
                            onChange={setProgram}
                        />

                        {/* Courses */}

                        <DropDown
                            label="Courses"
                            options={["Course A", "Course B"]}
                            icon={icons.courseIcon}
                            value={course}
                            onChange={setCourse}
                        />

                        {/* Support */}

                        <DropDown
                            label="Support"
                            options={["Support A", "Support B"]}
                            icon={icons.supportIcon}
                            value={support}
                            onChange={setSupport}
                        />



                        {/* Student Unions */}

                        <DropDown
                            label="Student Unions"
                            options={["Union A", "Union B"]}
                            icon={icons.studentUnionIcon}
                            value={studentUnion}
                            onChange={setStudentUnion}
                        />

                    </div>

                </div>
            </div>
            <div className="dashboard">
                <button className="dashboardBtn"><img src="/assets/icons/dashboardIcon.svg"></img>For Businesses: Check Dashboard</button>
                <button className="mobileAppBtn"><img src="/assets/icons/mobileAppIcon.svg"></img>For Job Seekers: Download App</button>
            </div>
            <MoreResource />
            <Footer />

        </div >
    );
};

export default Resource;
