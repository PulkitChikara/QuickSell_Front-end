import React, { useEffect } from "react";
import profile from "../Assets/profile.png";
import profile1 from "../Assets/profile1.png";
import profile4 from "../Assets/profile4.jpg";
import profile5 from "../Assets/profile5.jpg";
import profile6 from "../Assets/profile6.jpg";
import profile7 from "../Assets/profile7.jpg";

const Card = ({
  id,
  title,
  tag,
  userId,
  userData,
  priority,
  grouping,
  statusMapping,
}) => {
  const user = userData.find((user) => user.id === userId);
  const status = statusMapping[id];
  const getPriorityIcon = () => {
    const priorityValue = parseInt(priority, 10);
  
    switch (priorityValue) {
      case 0:
        return <i className="bx bx-dots-horizontal-rounded"></i>;
      case 1:
        return <i className="bx bx-signal-2"></i>;
      case 2:
        return <i className="bx bx-signal-3"></i>;
      case 3:
        return <i className="bx bx-signal-4"></i>;
      default:
        return <i className="bx bxs-message-square-error"></i>;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="status-heading">
          {grouping == "users" || grouping == "priority" ? (
            status == "Todo" ? (
              <i className="bx bx-circle" id="todo"></i>
            ) : status == "In Progress" ? (
              <i className="bx bx-adjust" id="progress"></i>
            ) : status == "Backlog" ? (
              <i className="bx bx-task-x" id="backlog"></i>
            ) : statusMapping[id] == "Done" ? (
              <i className="bx bxs-check-circle" id="done"></i>
            ) : (
              <i className="bx bxs-x-circle" id="cancel"></i>
            )
          ) : null}
          <p>{id}</p>
        </div>
        {grouping != "users" ? (
          <div
            className={
              user && !user.available
                ? "user-avatar-unavailable"
                : "user-avatar"
            }
          >
            <img
              src={
                userId == "usr-1"
                  ? profile1
                  : userId == "usr-2"
                  ? profile6
                  : userId == "usr-3"
                  ? profile7
                  : userId == "usr-4"
                  ? profile5
                  : userId == "usr-5"
                  ? profile4
                  : profile
              }
              className={
                user && !user.available
                  ? "user-avatar-unavailable"
                  : "user-avatar"
              }
              alt="user"
            ></img>
          </div>
        ) : null}
      </div>
      <div className="card-title">
        <p>{title}</p>
      </div>
      <div className="card-footer">
        {grouping !== "priority" && (
          <div className="feature-container">{getPriorityIcon()}</div>
        )}
        {tag?.map((value, index) => (
          <div className="feature-container" key={index}>
            <div className="alert-icon"></div>
            <div className="feature-request">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
