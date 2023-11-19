import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import Navbar from "../Components/Navbar";
import CustomSpinner from "../Components/CustomSpinner";

//Import Image
import profile from "../Assets/profile.png";
import profile1 from "../Assets/profile1.png";
import profile4 from "../Assets/profile4.jpg";
import profile5 from "../Assets/profile5.jpg";
import profile6 from "../Assets/profile6.jpg";
import profile7 from "../Assets/profile7.jpg";
import { FETCH_URL } from "../Config";

const Dashboard = () => {
  // State Variables
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({});
  const [user, setUser] = useState({});
  const [priority, setPriority] = useState({});
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');
  const [availableUser, setAvailableUser] = useState({});
  const [statusMapping, setStatusMapping] = useState({});
  const statusKeys = ["Backlog", "Todo", "In progress", "Done", "Canceled"];
  

  // Fetch Data 
  useEffect(() => {
    getData();
  }, [grouping, ordering]);

  const sortByTitle = (tickets) => tickets.sort((a, b) => a.title.localeCompare(b.title));

  // Grouping the data by Status
  const groupByStatus = (tickets) => {
    let sortedTickets = ordering === "title" ? sortByTitle(tickets) : tickets;
    const grouped = statusKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {});

    sortedTickets.forEach((ticket) => grouped[ticket.status].push(ticket));

    statusKeys.forEach((key) => {
      if (!grouped[key]) {
        grouped[key] = [];
      }
    });

    if (ordering === "priority") {
      for (let key in grouped) {
        grouped[key].sort((a, b) => b.priority - a.priority);
      }
    }

    return { Keys: statusKeys, ...grouped };
  };

  // Grouping the data by Priority
  const groupByPriority = (tickets) => {
    let sortedTickets = ordering === "title" ? sortByTitle(tickets) : tickets;
    const priorityObject = sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.priority]) {
        acc[ticket.priority] = [];
      }
      acc[ticket.priority].push(ticket);
      return acc;
    }, {});

    return { Keys: Object.keys(priorityObject), ...priorityObject };
  };

  // Grouping the data by users
  const groupByUser = (tickets) => {
    let sortedTickets = ordering === "title" ? sortByTitle(tickets) : tickets;
    const grouped = sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.userId]) {
        acc[ticket.userId] = [];
      }
      acc[ticket.userId].push(ticket);
      return acc;
    }, {});

    if (ordering === "priority") {
      for (let key in grouped) {
        grouped[key].sort((a, b) => b.priority - a.priority);
      }
    }

    return {
      Keys: userData.map((user) => user.id.toString()),
      ...grouped,
    };
  };

  // Available User (online/offline) 
  const availabilityMap = (users) => users.reduce((acc, user) => ({ ...acc, [user.id]: user.available }), {});

  const extractStatusMapping = (data) => data.tickets.reduce((acc, ticket) => ({ ...acc, [ticket.id]: ticket.status }), {});

  // Fetch API function
  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(FETCH_URL);
      const data = await response.json();
      setIsLoading(false);
      setUserData(data.users);
      setUser(groupByUser(data.tickets));
      setStatus(groupByStatus(data.tickets));
      setPriority(groupByPriority(data.tickets));
      setAvailableUser(availabilityMap(data.users));
      setStatusMapping(extractStatusMapping(data));
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };



const renderStatusGroup = (item, index) => (
  <div className="column" key={index}>
    <div className="Header">
      <div className="icon-text">
        {statusIcons[item] && <i className={statusIcons[item]} id={item.toLowerCase()}></i>}
        <span className="text">{item === "In progress" ? "In Progress" : item}</span>
        <span>{status[item]?.length}</span>
      </div>
      <div className="actions">
        <i className="bx bx-plus" id="plus"></i>
        <i className="bx bx-dots-horizontal-rounded" id="dots"></i>
      </div>
    </div>
    {status[item] && status[item].map(renderCard)}
  </div>
);

const renderUserGroup = (userId, index) => {
  const currentUserName = userData.find((u) => u.id.toString() === userId)?.name || "Unknown";

  return (
    <div className="column" key={index}>
      <div className="Header">
        <div className="icon-text">
          <div className={String(availableUser[userId]) === "false" ? "user-avatar-unavailable" : "user-avatar"}>
            <img
              src={userAvatars[userId] || profile}
              className={String(availableUser[userId]) === "false" ? "user-avatar-unavailable" : "user-avatar"}
              alt="user"
            ></img>
          </div>
          <span className="text">{currentUserName}</span>
          <span>{user[userId]?.length}</span>
        </div>
        <div className="actions">
          <i className="bx bx-plus" id="plus"></i>
          <i className="bx bx-dots-horizontal-rounded" id="dots"></i>
          </div>
        </div>
        {user[userId] && user[userId].map(renderCard)}
      </div>
    );
  };

  const renderPriorityGroup = (item, index) => (
    <div className="column" key={index}>
      <div className="Header">
        <div className="icon-text-priority">
          {priorityIcons[item] && <i className={priorityIcons[item]} id={`priority-${item}`}></i>}
          <span className="text">
            {`Priority ${item}` === "Priority 4"
              ? "Urgent"
              : `Priority ${item}` === "Priority 3"
              ? "High"
              : `Priority ${item}` === "Priority 2"
              ? "Medium"
              : `Priority ${item}` === "Priority 1"
              ? "Low"
              : "No Priority"}
          </span>
          <span className="count">{priority[item]?.length}</span>
        </div>
        <div className="actions">
          <i className="bx bx-plus" id="plus"></i>
          <i className="bx bx-dots-horizontal-rounded" id="dots"></i>
        </div>
      </div>
      {priority[item] && priority[item].map(renderCard)}
    </div>
  );

  const renderCard = (value) => (
    <Card
      id={value.id}
      title={value.title}
      tag={value.tag}
      userId={value.userId}
      status={status}
      userData={userData}
      priority={value.priority}
      key={value.id}
      grouping={grouping}
      ordering={ordering}
      statusMapping={statusMapping}
    />
  );

  const statusIcons = {
    Todo: "bx bx-circle",
    "In progress": "bx bx-adjust",
    Backlog: "bx bx-task-x",
    Done: "bx bxs-check-circle",
    Canceled: "bx bxs-x-circle",
  };

  const userAvatars = {
    "usr-1": profile1,
    "usr-2": profile6,
    "usr-3": profile7,
    "usr-4": profile5,
    "usr-5": profile4,
  };

  const priorityIcons = {
    0: "bx bx-dots-horizontal-rounded",
    1: "bx bx-signal-2",
    2: "bx bx-signal-3",
    3: "bx bx-signal-4",
    4: "bx bxs-message-square-error",
  };

  return (
    <>
      <div>
        <Navbar
          grouping={grouping}
          setGrouping={setGrouping}
          ordering={ordering}
          setOrdering={setOrdering}
          call={getData}
        />
        <div className="Dashboard-Container">
          {isLoading ? (
            <CustomSpinner />
          ) : (
            <>
              {grouping === "status" && status.Keys.map(renderStatusGroup)}
              {grouping === "users" &&
                availableUser &&
                user.Keys.map(renderUserGroup)}
              {grouping === "priority" &&
                priority.Keys.sort((a, b) => a - b).map(renderPriorityGroup)}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;