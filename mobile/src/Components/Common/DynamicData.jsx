export default function ulb_data() {
    
    let type = 'ranchi'
    const ulb = {
        

        ranchi: {
            brand_tag: "UD&HD",
            brand_name: "Urban Development & Housing Department",
            ulb_name: "Ranchi Municipal Corporation",
            district: "Ranchi",
            city: "Ranchi",
            state: "Jharkhand",
            address: "4th Floor Project Building, Dhurwa Ranchi",
            mobile_no: "18008904115",
            mobile_no_2: "06513500700",
            website: "udhd.jharkhand.gov.in",
            email: "ud.secy@gmail.com",
            brand_logo:'https://jharkhandegovernance.com/egov-backend/Uploads/Icon/jharkhand.png',
            state_logo: "https://jharkhandegovernance.com/egov-backend/Uploads/Icon/jharkhand.png",
            ulb_logo: 'https://res.cloudinary.com/djkewhhqs/image/upload/v1709034287/JUIDCO_IMAGE/ULB%20Logo/rmc_Logo_nqr7xn.jpg',
            loader_logo: 'http://203.129.217.246:8000/Uploads/Icon/udhd.svg',
            ulb_parent_website: 'https://akola.gov.in/',
        },
    }
    return ulb[type];


}