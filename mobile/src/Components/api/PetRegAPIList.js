import ApiHeader from "./ApiHeader";
import BackendUrl from "./BackendUrl"
// const BackendUrl = 'http://192.168.0.240:83'
// const BackendUrl = "http://192.168.0.202:2000";
// const BackendUrl = 'http://192.168.0.207:8000'

export default function PetRegAPIList() {

    let baseUrl = BackendUrl;

    const header = ApiHeader()

    // let token = window.localStorage.getItem('citizen_token')
    // const header = {
    //     headers:
    //     {
    //         Authorization: `Bearer ${token}`,
    //         Accept: 'application/json',
    //     }
    // }

    // window.sessionStorage.setItem("name", "Raja Ram Mohan Malvia")

    let apiList = {
        header1: header,
        header: header,

        api_ulbList: `${baseUrl}/api/get-all-ulb`, //GET
        api_wardList: `${baseUrl}/api/workflow/getWardByUlb`, // post,

        api_PetRegistrationMaster: `${baseUrl}/api/pet/get-master-data`,
        api_PetRegistrationApplyForm: `${baseUrl}/api/pet/application/apply-pet-registration`,
        api_PetApplyRenewalForm: `${baseUrl}/api/pet/registration/apply-renewal`,
        api_PetRegistrationDocUploadList: `${baseUrl}/api/pet/application/get-doc-to-upload`,
        api_PetRegistrationList: `${baseUrl}/api/pet/application/get-registration-list`,

        api_PetRegDeleteApplication: `${baseUrl}/api/pet/application/delete`,
        api_PetRegViewApplication: `${baseUrl}/api/pet/application/get-details`,
        api_PetRejectedViewApplication: `${baseUrl}/api/pet/get-rejected-registration-list`,
        api_PetApproveViewApplication: `${baseUrl}/api/pet/get-approve-registration-list`,
        api_PetPreviewViewApplication: `${baseUrl}/api/pet/get-renewal-registration-details`,
        api_PetRegUploadDocument: `${baseUrl}/api/pet/application/upload-docs`,
        api_ListOfSafHolding: `${baseUrl}/api/pet/citizen-holding-saf`,
        api_getUserDetailsByHoldingSaf: `${baseUrl}/api/pet/application/get-prop-details`,
        api_searchPetApplication: `${baseUrl}/api/pet/application/searh-application`,
        api_searchApprovedPetApplication: `${baseUrl}/api/pet/search-approved-applications`,
        api_searchRejectedPetApplication: `${baseUrl}/api/pet/search-rejected-applications`,
        api_ApprovedPetApplication: `${baseUrl}/api/pet/list-approved-application`,
        api_petRegistrationsPreviewList: `${baseUrl}/api/pet/get-renewal-history`,
        api_RejectedPetApplication: `${baseUrl}/api/pet/list-rejected-application`,
        api_petOfflinePayment: `${baseUrl}/api/pet/application/offline-payment`,
        api_petPaymentReceipt: `${baseUrl}/api/pet/application/payment-receipt`,
        api_peteditdetails: `${baseUrl}/api/pet/application/edit-pet-details`,
        api_petDashboardDetails: `${baseUrl}/api/pet/dashboard_details`,
        api_petCertificate: `${baseUrl}/api/pet/application/license`,
    }

    return apiList
}