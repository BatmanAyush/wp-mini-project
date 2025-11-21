import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./dashboard.module.css";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);

  console.log("I am logged in as:", user?._id);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Use env variable or fallback to localhost
        const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5003";
        const res = await fetch(`${baseUrl}/notification`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });
        
        const data = await res.json();
        
        // ---------------------------------------------------------
        // DYNAMIC FILTERING LOGIC
        // ---------------------------------------------------------
        // Only keep notifications where the recipientId matches MY ID.
        const myNotifications = data.filter((n) => {
            // Handle if recipientId is an object (populated) or a string
            const recipientId = typeof n.recipientId === 'object' ? n.recipientId._id : n.recipientId;
            return recipientId === user?._id;
        });

        console.log("All Notifications Fetched:", data);
        console.log("Filtered for ME:", myNotifications);

        setNotifications(myNotifications);
      } catch (error) {
        console.error(error);
      }
    };
    
    if (token) {
        fetchNotifications();
    }
  }, [token, user?._id]);

  const handleRead = async (id) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5003";
      await fetch(`${baseUrl}/notification/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error(error);
    }
  };

  console.log(notifications);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Vendor Dashboard</h2>
        <div className={classes.notifications}>
          <h3 className={classes.subtitle}>Order Notifications</h3>
          {notifications?.length === 0 ? (
            <h1 className={classes.noMsg}>No new orders yet.</h1>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleRead(n._id)}
                className={`${classes.notificationCard} ${
                  n.isRead ? classes.read : classes.unread
                }`}
              >
                <div className={classes.cardContent}>
                    <span className={classes.msg}>{n.message}</span>
                    <span className={classes.time}>
                        {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                    </span>
                </div>
                {!n.isRead && <div className={classes.blueDot}></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;