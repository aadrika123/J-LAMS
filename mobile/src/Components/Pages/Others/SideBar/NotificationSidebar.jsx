import * as React from "react";
import Drawer from "@mui/material/Drawer";
import { Badge, Card, Stack } from "@mui/material";
import { BsBell } from "react-icons/bs";
import axios from "axios";

const NotificationSidebar = () => {
  const [state, setState] = React.useState({ right: false });
  const [notificationData, setNotificationData] = React.useState([]);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // API URL
  const API_BASE_URL = import.meta.env.VITE_REACT_URL;
  const API_FETCH_NOTIFICATION = `${API_BASE_URL}/api/lams/v1/notifications/get`;

  // Fetch Notifications
  const getNotification = async () => {
    try {
      const token = localStorage.getItem('token');; 
      const response = await axios.get(API_FETCH_NOTIFICATION, {
        headers: {
          Authorization: `Bearer ${token}`, // Set Authorization Header
        },
      });
      if (response.data.success) {
        const notifications = response.data.data || [];
        setNotificationData(notifications);

        // Update notification count based on unseen notifications (status !== 2)
        const unseenCount = notifications.filter((notification) => !notification.isSeen).length;
        setNotificationCount(unseenCount);
      } else {
        console.error("Failed to fetch notifications:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ right: open });
  };

  React.useEffect(() => {
    getNotification(); // Fetch notifications when component is mounted
  }, []);

  const list = () => (
    <>
      <div className="flex justify-between bg-white p-2 sticky top-0 border-b">
        <h1 className="text-black font-semibold text-xl">Notifications</h1>
        <h1 className="bg-red-600 rounded-full p-1 px-3 text-white">
          {notificationCount}
        </h1> {/* Display notification count */}
      </div>

      <Stack
        sx={{
          width: 350,
          backgroundColor: "white",
          height: "100%",
          padding: "5px",
        }}
        spacing={1}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        {isLoading ? (
          <p>Loading notifications...</p>
        ) : notificationData.length > 0 ? (
          notificationData.map((data) => (
            <Card
              key={data.id}
              sx={{
                backgroundColor: data.status === 2 ? "#e0dcf4" : "white",
                boxShadow: "none",
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#e0dcf4" },
              }}
              className="p-3 cursor-pointer"
            >
              <div>
                <div className="text-blue-700 flex space-x-1 pb-1">
                  <p className="text-xs pr-1">Notification</p>
                  <p className="text-[10px] text-black pt-[1px] pl-1">
                    {new Date(data.created_at).toLocaleDateString()}
                  </p>
                </div>
                <h1 className="text-black">{data.asset_id}</h1>
                <p className="text-xMidYMid pt-2 text-black">{data.message}</p>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No notifications available.</p>
        )}
      </Stack>
    </>
  );

  return (
    <>
      <React.Fragment key="right">
        <Badge color="error" badgeContent={notificationCount || 0}>
          <BsBell
            onClick={toggleDrawer(true)}
            className="text-3xl font-semibold bg-[#4338CA] text-white rounded-md p-1 cursor-pointer"
          />
        </Badge>
        <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </>
  );
};

export default NotificationSidebar;
