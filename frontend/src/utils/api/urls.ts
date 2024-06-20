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
  };
};

export const ASSETS: Urls = {
  LIST: {
    get: "/asset/get?limit=7",
    create: "/asset/create",
    getById: "/asset/get-single",
    delete: "/asset/delete-single",
    update: "/asset/update-single",
    getAll: "/assets/ulb-get",
    validate: "dms/upload-gets"
    // /assets/ulb-get?
  },
};
