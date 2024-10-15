// 👉 Importing Packages 👈
import 'animate.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { contextVar } from '@/Components/context/contextVar';
import { getLocalStorageItemJsonParsed } from '@/Components/Common/localstorage';
import Login from '@/Components/Pages/Others/Login';
import ProtectedRoutes from '@/Components/Pages/Others/ProtectedRoutes';
import ErrorPage from '@/Components/Pages/Others/404/ErrorPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';

import FieldOfficer from "./Components/Pages/PMS/Fieldofficer/FieldOfficer";
import ViewByIdList from "./Components/Pages/PMS/Fieldofficer/ViewByIdList";
import ApprovalView from "./Components/Pages/PMS/Fieldofficer/ApprovalView";
import RejectView from "./Components/Pages/PMS/Fieldofficer/RejectedView";
import OnHoldView from "./Components/Pages/PMS/Fieldofficer/OnHoldView";
import BarGraph from "./Components/Pages/PMS/Graphs/BarGraph";
import FinanceGrant_Form from "./Components/Pages/PMS/Finance/FinanceGrant_Form";
import SudaScheme_Dtl from './Components/Pages/PMS/Finance/SudaScheme_Dtl';


const queryClient = new QueryClient();

function App() {
  // 👉 State constants 👈
  const [menuList, setmenuList] = useState(
    getLocalStorageItemJsonParsed('menuList')
  ); // to store menu list
  const [userDetails, setuserDetails] = useState(
    getLocalStorageItemJsonParsed('userDetails')
  ); // to store user details
  const [titleText, settitleText] = useState('');
  const [refresh, setrefresh] = useState(0);
  const [titleBarVisibility, settitleBarVisibility] = useState(true);
  const [heartBeatCounter, setheartBeatCounter] = useState(1); // to check authentication
  const [toggleBar, settoggleBar] = useState(
    window.innerWidth <= 763 ? false : true
  ); // toggle state for Side Bar

  // 👉 Manage sidebar to hide and show for responsiveness 👈
  window.addEventListener('resize', function () {
    window.innerWidth <= 763 && settoggleBar(false);
    window.innerWidth >= 1280 && settoggleBar(true);
  });

  // 👉 Context data used globally 👈
  const contextData = {
    notify: (toastData, toastType) => toast[toastType](toastData),
    menuList,
    setmenuList,
    userDetails,
    setuserDetails,
    titleText,
    settitleText,
    titleBarVisibility,
    settitleBarVisibility,
    heartBeatCounter,
    setheartBeatCounter,
    toggleBar,
    settoggleBar,
    refresh,
    setrefresh
  };

  // 👉 Routes Json 👈
  const allRoutes = [

    { path: "/field-officer", element: <FieldOfficer /> },
    { path:"/approval-view" ,element: <ApprovalView/> },
    { path: "/on-hold-view", element: <OnHoldView/> },
    { path: "/Rejected-view", element: <RejectView/> },
    { path: "/Graph-views", element: <BarGraph /> },
    { path: "/Finance_grant-Form", element: <FinanceGrant_Form /> },
    { path: "/Suda_scheme-Form", element: <SudaScheme_Dtl /> },




    { path: '/View-application/:id', element: <ViewByIdList /> }
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Toaster />

        <contextVar.Provider
          value={contextData}
          axiosInstance={AxiosInterceptors}
        >
          <Routes>
            <Route index element={<Login />} />

            <Route element={<ProtectedRoutes />}>
              {allRoutes?.map((elem, index) => (
                <Route
                  key={index + 1}
                  path={elem?.path}
                  element={elem?.element}
                />
              ))}
            </Route>

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </contextVar.Provider>
      </>
    </QueryClientProvider>
  );
}

export default App;

