//////////////////////////////////////////////////////////////////////////////////////
//    Author - Dimple Kumari
//    Version - 1.0
//    Date - 19/06/2024
//    Revision - 1
//    Project - JUIDCO
//    Component  - Loader
//    DESCRIPTION - page loader
//////////////////////////////////////////////////////////////////////////////////////

import zIndex from "@mui/material/styles/zIndex";
import { ThreeDots } from "react-loader-spinner";

export default function LoaderApi() {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-100 '>
      <ThreeDots
        visible={true}
        color='#4338ca'
        height='80'
        width='80'
        radius='9'
        ariaLabel='three-dots-loading'
      />
    </div>
  );
}
