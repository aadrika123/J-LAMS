import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { BsBell } from "react-icons/bs";
import { ASSETS } from '@/utils/api/urls';
import axios from "@/lib/axiosConfig";
// import axios from "axios";

// Define the types for the notification data
interface Notification {
  id: number;
  title: string;
  description: string;
  created_at: string;
  isSeen: boolean;
}

const NotificationSidebar: React.FC = () => {
  const [state, setState] = React.useState<{ right: boolean }>({ right: false });
  const [notificationData, setNotificationData] = React.useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const toggleDrawer = (anchor: "right", open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && "key" in event) {
      const keyboardEvent = event as React.KeyboardEvent;
      if (keyboardEvent.key === "Tab" || keyboardEvent.key === "Shift") {
        return;
      }
    }
    setState({ ...state, [anchor]: open });
  };

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Retrieve the access token from localStorage
        const token = localStorage.getItem("accesstoken");
        // console.log("tttttttttttttttt", token)

        const response = await axios.get(`${ASSETS.LIST.notifications}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token here
          },
        });

        const data = response.data.data; // Extract the `data` array from the response
        const notifications: Notification[] = data.map((item: any) => ({
          id: item.id,
          title: item.asset_id, // Placeholder title if not provided
          description: item.message || "No description available",
          created_at: item.created_at,
          // isSeen: item.status === 2, // Example logic for marking as seen
        }));

        setNotificationData(notifications);
        const unseenCount = notifications.filter((notification) => !notification.isSeen).length;
        setNotificationCount(unseenCount);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotificationData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const list = (anchor: "right") => (
    <>
      <div className="flex justify-between bg-white p-2 sticky top-0 border-b">
        <h1 className="text-black font-semibold text-xl">Notification</h1>
        <h1 className="bg-red-600 rounded-full p-1 px-3 text-white">
          {notificationCount}
        </h1>
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
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <div className="flex flex-col space-y-2">
          {isLoading ? (
            <p>Loading notifications...</p>
          ) : notificationData.length > 0 ? (
            notificationData.map((data, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: data.isSeen ? "#e0dcf4" : "white",
                  boxShadow: "none",
                  transition: "background-color 0.3s ease",
                  "&:hover": { backgroundColor: "#e0dcf4" },
                }}
                className="p-3 cursor-pointer"
                onClick={() => console.log(`Notification ID: ${data.id}`)}
              >
                <div>
                  <div className="text-blue-700 flex space-x-1 pb-1">
                    <p className="text-xs pr-1">Notification</p>
                    <p className="text-[10px] text-black pt-[1px] pl-1">
                      {data.created_at.split("T")[0]}
                    </p>
                  </div>
                  <h1 className="text-black">{data.title}</h1>
                  <p className="text-xs pt-2 text-black">{data.description}</p>
                </div>
              </Card>
            ))
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      </Stack>
    </>
  );

  return (
    <>
      <React.Fragment key="right">
        <Badge color="error" badgeContent={notificationCount || ""}>
          <BsBell
            onClick={toggleDrawer("right", true)}
            className="text-3xl font-semibold bg-[#4338CA] text-white rounded-md p-1 cursor-pointer"
          />
        </Badge>
        <Drawer
          anchor="right"
          open={state.right}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </React.Fragment>
    </>
  );
};

export default NotificationSidebar;
