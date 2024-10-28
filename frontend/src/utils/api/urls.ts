/**
 * Author: Krish
 * use: For API URLs
 * status: Open
 */

type UrlKeys =
  | "LIST";

type Urls = {
  [key in UrlKeys]: {
    get?: string;
    create?: string;
    update?: string;
    updateMany?: string;
    getById?: string;
    getAllById?: string;
    delete?: string;
    getCodes?: string;
    getAll?: string;
    validate?: string;
    count?: string;
    getAllData?: string;
    getAllAudit?:string;
    getcsvdata?:string;
  };
};

export const ASSETS: Urls = {
  LIST: {
    get: "/asset/get",
    create: "/asset/create",
    getById: "/asset/get-single",
    delete: "/asset/delete-single",
    update: "/asset/update-single",
    getAll: "/assets/ulb-get",
    validate: "dms/upload-gets",
    count: "/assets/update-list?limit=7",
    getAllData: "/assets/field-officer-list?limit=7",
    getAllAudit: "/assets/auditlog-list?limit=10",
    updateMany:"/assets/checker-list?limit=100",
    getcsvdata: "/asset/getcsvdata?",
    
  },
};
