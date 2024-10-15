import * as React from "react";
// import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import toast from "react-hot-toast";
import { BsBell } from "react-icons/bs";
import { Badge, Card, Grid, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AxiosInterceptors from "@/Components/Common/AxiosInterceptors";
import ApiHeader from "@/Components/api/ApiHeader";
import ProjectApiList from "@/Components/api/ProjectApiList";
import { FaCircleDot } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { getLocalStorageItem } from "@/Components/Common/localstorage";

export default function NotificationSidebar() {
  const { api_fetchNotification, api_readNotification } = ProjectApiList();

  const navigate = useNavigate();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [notificationData, setNotificationData] = React.useState();
  const [notificationCount, setNotificationCount] = React.useState();
  const [notifiRefresh, setNotifiRefresh] = React.useState(false);

  //Get notification data

  const getNotification = () => {
    AxiosInterceptors.get(`${api_fetchNotification}`, ApiHeader())
      .then(function (response) {
        if (response?.data?.status) {
          setNotificationCount(response?.data);
          setNotificationData(response?.data?.data);

          // setisLoading(false);
        } else {
          // setisLoading(false);
          toast.error(response?.data?.message);
        }
      })
      .catch(function (error) {
        // toast.error("Error while fetching Notifications");
        console.log("==2 details by id error...", error);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };

  // console.log(notificationData);

  //Read notification data

  const readNotification = (id) => {
    AxiosInterceptors.post(
      `${api_readNotification}`,
      { notification_id: id },
      ApiHeader()
    )
      .then(function (response) {
        if (response?.data?.status) {
          setNotifiRefresh((prev) => !prev);
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch(function (error) {
        toast.error("Error in updating status");
        console.log("==2 details by id error...", error);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };

  const notifiNavigate = (status, id) => {
    readNotification(id);

    if (status == 10) {
      navigate("/sr-inventory-proposal");
    } else if (status == 14) {
      navigate("/sr-rejectedlist");
    } else if (status == 15) {
      navigate("/sr-releasedlist");
    } else if (status == 20) {
      navigate("/da-inventory-proposal");
    } else if (status == 21) {
      navigate("/da-boq");
    } else if (status == 22) {
      navigate("/da-pre-tendring");
    } else if (status == 30) {
      navigate("/accountant-boq");
    } else if (status == 31) {
      navigate("/accountant-boq");
    } else if (status == 32) {
      navigate("/acc-pre-tendring");
    } else if (status == 11) {
      navigate("/sr-post-inventory");
    } else if (status == 12) {
      navigate("/sr-received-inventory");
    } else if (status == 23) {
      navigate("/da-post-precurement");
    } else if (status == 24) {
      navigate("/da-received-inventory");
    } else {
      navigate("/sr-inventory-dashboard");
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  React.useEffect(() => {
    getNotification();
  }, [notifiRefresh]);

  const list = (anchor) => (
    <>
      <div className="flex justify-between  bg-white p-2 sticky top-0 border-b">
        <h1 className="text-black font-semibold text-xl">Notification</h1>
        <div className="rounded-s-lg  bg-red-500 pl-2 pr-2 text-white">
          <h1 className="">{notificationCount?.totalCount}</h1>
        </div>
      </div>

      <Stack
        sx={{
          width: anchor === "top" || anchor === "bottom" ? "auto" : 350,
          backgroundColor: "white",
          height: "100%",
          padding:"5px",
          borderBottom: "2px",
        }}
        spacing={1}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <div className="flex flex-col space-y-2 ">
          {notificationData?.map((data, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor:
                  data?.isSeen == false ? "white" : "#e0dcf4",
                boxShadow: "none",
                transition: "background-color 0.3s ease", 
                "&:hover": {
                  backgroundColor: "#e0dcf4",
                },
              }}
              className="p-3 cursor-pointer "
              onClick={() => notifiNavigate(data?.destination, data?.id)}
            >
              <div className="">
                <div className="text-blue-700 flex space-x-1 pb-1">
                  <FaCircleDot className="text-xs mt-[1.5px]" />
                  <p className="text-xs pr-1">Accountant</p>
                  <p className="text-xs"><FaCircle className="text-[5px] mt-[5px] text-black" /></p>
                  {/* <p className="text-[10px] text-black pt-[1px] pl-1">22 July 12:20 AM</p> */}
                </div>
                {/* <h1 className=" text-black">{data?.title}</h1> */}
                {/* <p className="text-xs pt-2 text-black ">{data?.description}</p> */}
                {/* <hr className="" /> */}
              </div>
            </Card>
          ))}
        </div>
      </Stack>
    </>
  );

  return (
    <>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Badge
            color="error"
            badgeContent={notificationCount?.unseenCount || 0}
          >
            <BsBell
              onClick={toggleDrawer(anchor, true)}
              className="text-3xl font-semibold bg-[#4338CA] text-white rounded-md p-1 cursor-pointer "
              data-tooltip-content="Show all notifications."
            >
              {anchor}
            </BsBell>
          </Badge>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            // styles={{backgroundColor:"blue"}}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
}
