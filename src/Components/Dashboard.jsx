import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useFetcher, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import ClientSidebar from "./ClientSidebar";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, LabelList } from "recharts";
import { AreaChart, Area, CartesianGrid } from "recharts";
import Box from "@mui/material/Box";
import { ThreeCircles } from "react-loader-spinner";
import Nav from "./Nav";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Autocomplete } from "@mui/material";
import ClientDashboard from "./ClientDashboard";

function Dashboard(props) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [Projectdata, setProjectData] = useState([]);
  const [Name, setName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [projectIdExists, setProjectIdExists] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([
    "In Progress",
    "In Review",
    "To be Tested",
  ]);
  const [selectedFrequency, setSelectedFrequency] = useState("Monthly");
  useEffect(() => {
    // You can add any side effects here if needed when selectedStatuses changes
  }, [selectedStatuses]);

  const jsonString = localStorage.getItem("Loginres");
  const ResToken = JSON.parse(jsonString);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          "http://localhost:5000/getAllProjects",
          {
            accessToken: ResToken.Res_Token.access_token, // Send the token in the request body
          }
        );
        setProjectData(response.data.projects);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formattedData = Projectdata.map((project) => ({
    name: project.name, // Using project name as the X-axis label
    openTasks: project.task_count.open, // Open tasks count
    closedTasks: project.task_count.closed, // Closed tasks count
    startDate: project.start_date, // Project start date (optional, if you want to use this)
    // Add any other properties you want to plot
  }));

  const handleProjectSelect = async (event) => {
    const selectedName = event.target.value;
    const project = Projectdata.find(
      (project) => project.name === selectedName
    );
    setSelectedProjectId(project?.id_string);
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:5000/getallTasks/${project?.id_string}`,
        {
          accessToken: ResToken.Res_Token.access_token, // Send the token in the request body
        }
      );
      setData(response.data.tasks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Extract unique names
    const namesSet = new Set();
    data.forEach((item) => {
      item.details.owners.forEach((ite) => {
        namesSet.add(ite.full_name);
      });
    });
    setUniqueNames(Array.from(namesSet));
  }, [data]);

  const handlelog = () => {
    localStorage.clear();
    navigate("/");
  };

  const allowedStatuses = [
    "Closed",
    "In Progress",
    "In Review",
    "Open",
    "To be Tested",
  ];

  const filteredData = data.filter(
    (item) =>
      selectedUser === "" ||
      (item.details.owners.some((ite) => ite.full_name === selectedUser) &&
        allowedStatuses.includes(item.status.name))
  );

  const filteredDataforPIE = data.filter(
    (item) =>
      selectedUser === "" ||
      item.details.owners.some((ite) => ite.full_name === selectedUser)
  );

  // Prepare data for the bar chart
  const chartData = filteredDataforPIE.map((item) => ({
    Taskname: item.name, // Task name or project name
    startdate: item.created_time_format,
    enddate: item.end_date_format,
    value: item.value || 1,
  }));
  const COLORSS = [
    "rgb(8,174,234)",
    "rgb(255,123,215)",
    "rgb(112,240,112)",
    "rgb(245,181,131)",
    "rgb(245,107,98)",
    "#FF69B4",
  ];

  useEffect(() => {
    const storedResponseString = localStorage.getItem("Loginres");
    const storedResponse = JSON.parse(storedResponseString);

    setName(storedResponse);
  }, []);

  // STACKED BAR GRAPH

  const COLORS = {
    InProgress: "rgb(8,174,234)", // Greenrgb(18,35,158)
    InReview: "rgb(255,123,215)", // Blue
    Closed: "rgb(112,240,112)", // Red
    Tobetested: "rgb(245,181,131)",
    Open: "rgb(245,107,98)",
    // Yellow
  };

  const handlecheckbox = (event) => {
    const { value, checked } = event.target;
    setSelectedStatuses((prev) =>
      checked ? [...prev, value] : prev.filter((status) => status !== value)
    );
  };

  // const chartDataas = filteredData
  // .filter((item) => selectedStatuses.includes(item.status.name))
  // .map((item) => ({
  //   Taskname: item.name,
  //   startdate: new Date(item.created_time_format).getTime(),
  //   enddate: new Date(item.end_date_format).getTime(),
  //   status: item.status.name,
  //   value: new Date(item.created_time_format).getTime()
  // }));

  // const chartDataas =
  //   selectedStatuses.length === 0
  //     ? filteredData.map((item) => {
  //         return {
  //           Taskname: item.name,
  //           startdate: new Date(item.created_time_format).getTime(),
  //           enddate: new Date(item.last_updated_time_format).getTime(),
  //           status: item.status.name,
  //           value:  new Date(item.created_time_format).getTime()
  //           // value:
  //           //   new Date(item.last_updated_time_format).getTime() -
  //           //   new Date(item.created_time_format).getTime(),
  //         };
  //       })
  //     : filteredData
  //         .filter((item) => selectedStatuses.includes(item.status.name))
  //         .map((item) => ({
  //           Taskname: item.name,
  //           startdate: new Date(item.created_time_format).getTime(),
  //           enddate: new Date(item.end_date_format).getTime(),
  //           status: item.status.name,
  //           value:  new Date(item.created_time_format).getTime()
  //           // value:
  //           //   new Date(item.end_date_format).getTime() -
  //           //   new Date(item.created_time_format).getTime(),
  //         }));

  const getStatusColor = (status) => {
    switch (status) {
      case "In Review":
        return COLORS.InReview;
      case "In Progress":
        return COLORS.InProgress;
      case "Closed":
        return COLORS.Closed;
      case "To be Tested":
        return COLORS.onHold;
      case "Open":
        return COLORS.Open;
      default:
        return "black";
    }
  };

  useEffect(() => {
    const projectid = localStorage.getItem("ClientProjectId");
    if (projectid) {
      setProjectIdExists(true);
    }
  }, []);

  // // Function to find minimum date
  // const findMinDate = (data) => {
  //   const minDate = new Date(
  //     Math.min(...data.map((item) => new Date(item.startdate)))
  //   );
  //   return minDate;
  // };

  // // Function to find maximum date
  // const findMaxDate = (data) => {
  //   const maxDate = new Date(
  //     Math.max(...data.map((item) => new Date(item.enddate)))
  //   );
  //   return maxDate;
  // };

  // // Function to generate ticks for the X-axis
  // const generateTicks = (minDate, maxDate) => {
  //   const ticks = [];
  //   const currentDate = new Date(minDate);
  //   while (currentDate <= maxDate) {
  //     ticks.push(currentDate.getTime());
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }
  //   return ticks;
  // };

  // // Find the minimum and maximum dates
  // const minStartDate = findMinDate(chartDataas);
  // const maxEndDate = findMaxDate(chartDataas);

  // // Generate ticks for the X-axis
  // const ticks = generateTicks(minStartDate, maxEndDate);

  // // Function to format dates
  // const formatDates = (date) => {
  //   const formattedDate = new Date(date).toLocaleDateString("en-US", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   });
  //   return formattedDate;
  // };

  // NEW CODE OF FILTERS

  const groupDataByFrequency = (data, frequency) => {
    const groupedData = {};

    data.forEach((item) => {
      const taskDate = new Date(item.created_time_format);
      let key;

      if (frequency === "Daily") {
        key = taskDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      } else if (frequency === "Weekly") {
        const weekStartDate = new Date(
          taskDate.setDate(taskDate.getDate() - taskDate.getDay())
        );
        key = weekStartDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      } else if (frequency === "Monthly") {
        key = `${taskDate.toLocaleDateString("en-US", {
          month: "long",
        })} ${taskDate.getFullYear()}`;
      } else if (frequency === "Yearly") {
        key = taskDate.getFullYear().toString();
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          Taskname: item.name,
          startdate: new Date(item.created_time_format).getTime(),
          enddate: new Date(item.end_date_format).getTime(),
          status: item.status.name,
          value: new Date(item.created_time_format).getTime(),
        };
      } else {
        // Increment count or aggregate based on your requirement
        groupedData[key].value += 1;
      }
    });

    return Object.values(groupedData);
  };

  // const groupDataByFrequency = (data, frequency) => {
  //   const groupedData = {};

  //   data.forEach((item) => {
  //     const taskDate = new Date(item.created_time_format);
  //     let key;
  //     let value;

  //     // Format the key and value based on the selected frequency
  //     if (frequency === 'Daily') {
  //       key = taskDate.toLocaleDateString('en-US', {
  //         day: '2-digit',
  //         month: 'long',
  //         year: 'numeric',
  //       });
  //       value = taskDate.getTime();
  //     } else if (frequency === 'Weekly') {
  //       const weekStartDate = new Date(taskDate.setDate(taskDate.getDate() - taskDate.getDay()));
  //       key = weekStartDate.toLocaleDateString('en-US', {
  //         day: '2-digit',
  //         month: 'long',
  //         year: 'numeric',
  //       });
  //       value = weekStartDate.getTime();
  //     } else if (frequency === 'Monthly') {
  //       key = `${taskDate.toLocaleDateString('en-US', { month: 'long' })} ${taskDate.getFullYear()}`;
  //       value = new Date(taskDate.getFullYear(), taskDate.getMonth(), 1).getTime();
  //     } else if (frequency === 'Yearly') {
  //       key = taskDate.getFullYear().toString();
  //       value = new Date(taskDate.getFullYear(), 0, 1).getTime();
  //     } else {
  //       key = taskDate.toLocaleDateString('en-US', {
  //         day: '2-digit',
  //         month: 'long',
  //         year: 'numeric',
  //       });
  //       value = taskDate.getTime();
  //     }

  //     // Populate grouped data
  //     if (!groupedData[key]) {
  //       groupedData[key] = {
  //         Taskname: item.name,
  //         startdate: new Date(item.created_time_format).getTime(),
  //         enddate: new Date(item.end_date_format).getTime(),
  //         status: item.status.name,
  //         value: value,
  //       };

  //       // Console log the newly created entry
  //       console.log('New Entry Added:', groupedData[key].value);
  //     } else {
  //       // Increment count or aggregate based on your requirement
  //       groupedData[key].value += 1;
  //     }
  //   });

  //   return Object.values(groupedData);
  // };

  // Filter data and group by selected frequency
  const chartDataas = groupDataByFrequency(
    filteredData.filter((item) => selectedStatuses.includes(item.status.name)),
    selectedFrequency
  );

  // Function to find minimum and maximum dates
  // const findMinDate = (data) =>
  //   new Date(Math.min(...data.map((item) => item.startdate)));
  // const findMaxDate = (data) =>
  //   new Date(Math.max(...data.map((item) => item.enddate)));

  // Function to generate ticks for the X-axis based on selected frequency
  // const generateTicks = (minDate, maxDate, frequency) => {
  //   const ticks = [];
  //   const currentDate = new Date(minDate);
  //   while (currentDate <= maxDate) {
  //     ticks.push(currentDate.getTime());
  //     if (frequency === "Daily") {
  //       currentDate.setDate(currentDate.getDate() + 1);
  //     } else if (frequency === "Weekly") {
  //       currentDate.setDate(currentDate.getDate() + 7);
  //     } else if (frequency === "Monthly") {
  //       currentDate.setMonth(currentDate.getMonth() + 1);
  //     } else if (frequency === "Yearly") {
  //       currentDate.setFullYear(currentDate.getFullYear() + 1);
  //     }
  //   }
  //   return ticks;
  // };

  // Find the minimum and maximum dates
  // const minStartDate = findMinDate(chartDataas);
  // const maxEndDate = findMaxDate(chartDataas);

  // Generate ticks for the X-axis based on selected frequency
  // const ticks = generateTicks(minStartDate, maxEndDate, selectedFrequency);

  // Function to format dates according to the selected frequency
  // const formatDates = (date) => {
  //   const options =
  //     selectedFrequency === "Yearly"
  //       ? { year: "numeric" }
  //       : selectedFrequency === "Monthly"
  //       ? { day: "2-digit", month: "short", year: "numeric" }
  //       : selectedFrequency === "Weekly"
  //       ? { day: "2-digit", month: "short", year: "numeric" }
  //       : { day: "2-digit", month: "short", year: "numeric" };
  //   return new Date(date).toLocaleDateString("en-US", options);
  // };

  const minValue = Math.min(...chartDataas.map((data) => data.startdate));
  const maxValue = Math.max(...chartDataas.map((data) => data.enddate));

  const formatDates = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {projectIdExists === true ? (
        <ClientDashboard />
      ) : (
        <>
       
          <Nav/>

          <div className="row">
            <div className="col-lg-2 ">
              {projectIdExists === true ? <ClientSidebar /> : <Sidebar />}
            </div>

            <div className="col-lg-10 t4">
              <div className="container">
                <p className="text-start  a2 mt-1 ">Dashboard</p>
                <p className="a3 text-start  ">
                  Home / <span className=" a26">Dashboard</span>
                </p>

                <div className="row mt-4">
                  <div className="col-lg-4 a41">
                    <p className="d-flex a5 mt-2">Total Projects</p>
                    <div className="d-flex">
                      <div className="d-flex a8">
                        <AiOutlineShoppingCart className="a9 " />
                      </div>
                      <h4 className="aq1">{Projectdata?.length}</h4>
                    </div>
                    <p className="aq2">Total Projects</p>
                  </div>
                  <div className="col-lg-4 a43">
                    <p className="d-flex a5 mt-2">Total Clients</p>
                    <div className="d-flex">
                      <div className="d-flex a8">
                        <AiOutlineShoppingCart className="a13 " />
                      </div>
                      <h4 className="aq1">29</h4>
                    </div>
                    <p className="aq2a">Total Clients</p>
                  </div>
                  <div className="col-lg-4 a42">
                    <p className="d-flex a5 mt-2">Total Task</p>
                    <div className="d-flex">
                      <div className="d-flex a8">
                        <AiOutlineShoppingCart className="a14 " />
                      </div>
                      <h4 className="aq1">{data?.length}</h4>
                    </div>
                    <p className="aq2b">Total Task</p>
                  </div>
                </div>

                {/* CHARTS */}

                {/* AREA CHART  */}

                <div className="linechatt">
                  <div className="mt-3 d-flex justify-content-end">
                    {/* <h5>Select Project :-</h5> */}
                    <select
                      className="form-select sel-project"
                      aria-label="Default select example"
                      onChange={handleProjectSelect}
                    >
                      <option value="">Select a Project</option>
                      {Projectdata.map((item, index) => (
                        <option key={index} value={item.item_string}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={400}
                    className="mt-3"
                  >
                    <AreaChart data={formattedData}>
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#82ca9d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#82ca9d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="openTasks"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                      />
                      <Area
                        type="monotone"
                        dataKey="closedTasks"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {selectedProjectId ? (
                  <>
                    {loading ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="50vh" // Full viewport height
                      >
                        <ThreeCircles
                          visible={true}
                          height="80"
                          width="100"
                          color="rgb(13,110,253)" // Change the color to your desired color
                          ariaLabel="three-circles-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </Box>
                    ) : (
                      <>
                        <h4 className="text-center mt-3">Users Report</h4>

                        <div className=" d-flex ">
                          <div className="mt-3 dateselect1">
                            {/* <h5>Select User :-</h5> */}
                            <select
                              class="form-select"
                              aria-label="Default select example"
                              value={selectedUser}
                              onChange={(e) => setSelectedUser(e.target.value)}
                            >
                              <option value="">Select a User</option>
                              {uniqueNames.map((name, index) => (
                                <option key={index} value={name}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-3 dateselect">
                            {/* <h5>Select User :-</h5> */}
                            <select
                              class="form-select"
                              aria-label="Default select example"
                              value={selectedFrequency}
                              onChange={(e) =>
                                setSelectedFrequency(e.target.value)
                              }
                            >
                              <option value="">Select a Date</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                            </select>
                          </div>
                        </div>

                        <div className="container mt-3 d-flex ststas">
                          {/* <h4 className="hdd">Status</h4> */}
                          <h6>
                            <li class="red-bullet ">
                              <span>
                                {" "}
                                <input
                                  className="jk-3"
                                  type="checkbox"
                                  value="Closed"
                                  onChange={handlecheckbox}
                                />
                              </span>{" "}
                              Completed
                            </li>
                          </h6>
                          <h6>
                            <li class="blue-bullet">
                              <span>
                                {" "}
                                <input
                                  class=""
                                  type="checkbox"
                                  value="In Progress"
                                  onChange={handlecheckbox}
                                  defaultChecked={true}
                                />
                              </span>{" "}
                              In Progress
                            </li>
                          </h6>
                          <h6>
                            <li class="pink-bullet ">
                              <span>
                                {" "}
                                <input
                                  class=""
                                  type="checkbox"
                                  value="In Review"
                                  onChange={handlecheckbox}
                                  defaultChecked={true}
                                />
                              </span>{" "}
                              In Review
                            </li>
                          </h6>
                          <h6>
                            <li class="open-bullet ">
                              <span>
                                {" "}
                                <input
                                  class=""
                                  type="checkbox"
                                  value="Open"
                                  onChange={handlecheckbox}
                                />
                              </span>{" "}
                              Open
                            </li>
                          </h6>
                          <h6>
                            <li class="tobe-bullet">
                              <span>
                                {" "}
                                <input
                                  class=""
                                  type="checkbox"
                                  value="To be Tested"
                                  onChange={handlecheckbox}
                                  defaultChecked={true}
                                />
                              </span>{" "}
                              To be Tested
                            </li>
                          </h6>
                        </div>

                        {/* BAR GRAPGH  */}
                        <div style={{ display: "flex", marginTop: "3%" }}>
                          {/* <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={chartDataas} layout="vertical">
                              {" "}
                              <XAxis
                                type="number"
                                // scale="time"
                                domain={[
                                  minStartDate.getTime(),
                                  maxEndDate.getTime(),
                                ]}
                                // ticks={ticks}
                                tickFormatter={(tick) => formatDates(tick)}
                              />
                              <YAxis
                                type="category"
                                // dataKey="Taskname"
                              />
                              <Tooltip
                                content={({ payload }) => {
                                  if (payload && payload.length) {
                                    const {
                                      Taskname,
                                      startdate,
                                      enddate,
                                      status,
                                    } = payload[0].payload;
                                    return (
                                      <div>
                                        <p>
                                          <strong>Task Name: {Taskname}</strong>
                                        </p>
                                        <p>
                                          <strong>
                                            Start Date:{" "}
                                            {new Date(
                                              startdate
                                            ).toLocaleDateString()}
                                          </strong>
                                        </p>
                                        <p>
                                          <strong>
                                            End Date:{" "}
                                            {new Date(
                                              enddate
                                            ).toLocaleDateString()}
                                          </strong>
                                        </p>
                                        <p>
                                          <strong>
                                            Status:{" "}
                                            {status === "Closed"
                                              ? "Completed"
                                              : status}
                                          </strong>
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar
                                dataKey="value"
                                radius={[20, 20, 20, 20]}
                                minPointSize={3}
                                barSize={30}
                              >
                                {chartDataas.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={getStatusColor(entry.status)}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer> */}

                          <ResponsiveContainer
                            width="100%"
                            height={500}
                            className=""
                          >
                            <BarChart data={chartDataas} layout="vertical">
                              <XAxis
                                //  type="number"
                                domain={[minValue, maxValue]}
                                tickFormatter={(tick) => formatDates(tick)}
                              />
                              {/* <YAxis type="category" dataKey="Taskname" /> */}
                              <YAxis
      type="category"
      dataKey="Taskname"
      tick={({ x, y, payload }) => {
        const fullText = payload.value;
        const words = fullText.split(" ");
        const truncatedText = words.slice(0, 1).join(" ") + (words.length > 1 ? ".." : ""); // Truncate to 4 words
        
        return (
          <g transform={`translate(${x},${y})`}>
            <text
              x={0} // Align text horizontally
              y={0}
              dy={4} // Adjust vertical alignment
              textAnchor="end" // Align text to the right
              style={{ fontSize: "14px", cursor: "pointer" }}
            >
              <title>{fullText}</title> {/* Tooltip with full text */}
              {truncatedText}
            </text>
          </g>
        );
      }}
    />
                              <Tooltip
                                content={({ payload }) => {
                                  if (payload && payload.length) {
                                    const {
                                      Taskname,
                                      startdate,
                                      enddate,
                                      status,
                                    } = payload[0].payload;
                                    return (
                                      <div className="container tooltipgraph">
                                        <p className="mt-2">
                                          <strong>Task Name: {Taskname}</strong>
                                        </p>
                                        <p>
                                          <strong>
                                            Start Date:{" "}
                                            {new Date(
                                              startdate
                                            ).toLocaleDateString()}
                                          </strong>
                                        </p>
                                        <p>
                                          <strong>
                                            End Date:{" "}
                                            {new Date(
                                              enddate
                                            ).toLocaleDateString()}
                                          </strong>
                                        </p>
                                        <p>
                                          <strong>
                                            Status:{" "}
                                            {status === "Closed"
                                              ? "Completed"
                                              : status}
                                          </strong>
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar
                                dataKey="value"
                                radius={[20, 20, 20, 20]}
                                minPointSize={3}
                                barSize={30}
                              >
                                {chartDataas.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={getStatusColor(entry.status)}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* The Pie Chart */}
                        <h4 className="text-center mt-3">Task Reports</h4>
                        <div style={{ display: "flex" }}>
                          <ResponsiveContainer width="50%" height={400}>
                            <PieChart>
                              <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="Taskname"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                              >
                                {chartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORSS[index % COLORSS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                content={({ payload }) => {
                                  if (payload && payload.length) {
                                    const { Taskname, startdate, enddate } =
                                      payload[0].payload;
                                    return (
                                      <div>
                                        <p>
                                          <strong>{Taskname}</strong>
                                        </p>
                                        <p>Start Date: {startdate}</p>
                                        <p>End Date: {enddate}</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>

                          <div
                            style={{ marginLeft: "20px", marginTop: "50px" }}
                            className="piechart"
                          >
                            <ul>
                              {chartData.map((item, index) => (
                                <li
                                  key={index}
                                  style={{
                                    color: COLORSS[index % COLORSS.length],
                                  }}
                                >
                                  {item.Taskname}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
              <br /> <br />
              <div className="hr_line"></div>
              <p className="p11 text-center mt-2">
                {" "}
                Copyright <span className="p12">Designers X.</span> All Rights
                Reserved
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
