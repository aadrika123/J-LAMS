
// import React, { useEffect } from 'react';
// import { useGeolocated } from 'react-geolocated';

// export default function useGeoLocation() {
//     const {
//         isGeolocationAvailable,
//         isGeolocationEnabled,
//         getPosition,
//         coords,
//         positionError,
//         timestamp
//     } = useGeolocated({
//         positionOptions: {
//             enableHighAccuracy: true,
//             timeout: Infinity,
//             maximumAge: localStorage.getItem('geoMaxAge') || Infinity
//         },
//         watchPosition: true,
//         userDecisionTimeout: 5000
//     });

//     return {
//         isGeolocationAvailable,
//         isGeolocationEnabled,
//         coords,
//         positionError,
//         timestamp,
//         getPosition
//     };
// }
