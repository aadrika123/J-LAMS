/**
 * Author: Krish
 * use: For API URLs
 * status: Open
 */

type UrlKeys =
  | "LIST";

type Urls = {
  [key in UrlKeys]: {
    getmoduleId: any;
    get?: string;
    getRestructuredAssets?: string;
    create?: string;
    reCreate?: string;
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
    marketcircle?:string;
    locationadd?: string;
    locationEdit?:string;
    locationDelete?:string;
    locationselect?: string;
    notifications?: string;
    buildingName?: string;
  };
};

export const ASSETS: Urls = {
  LIST: {
    get: "/asset/get",
    getRestructuredAssets: "/assets/get-restructured",
    create: "/asset/create",
    reCreate: "/asset/re-create",
    getById: "/asset/get-single",
    delete: "/asset/delete-single",
    update: "/asset/update-single",
    getAll: "/assets/ulb-get",
    validate: "dms/upload-gets",
    count: "/assets/update-list?limit=7",
    getAllData: "/assets/field-officer-list?limit=7",
    getAllAudit: "/assets/auditlog-list?limit=10",
    updateMany: "/assets/checker-list?limit=100",
    getcsvdata: "/asset/getcsvdata?",
    marketcircle: "/asset/marketcircle?",
    locationadd: "/asset/locationadd",
    locationEdit: "/asset/location-edit",
    locationDelete: "/asset/location-delete",
    locationselect: "asset/locationselect?",
    notifications: "/notifications/get",
    buildingName: "/asset/get-circle-by-location",
    getmoduleId: undefined
  },
};


export const module: Urls = {
  LIST: {
    getmoduleId: "menu/by-module",

  }
}