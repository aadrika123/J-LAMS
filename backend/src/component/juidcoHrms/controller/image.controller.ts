/**
 * | Author- Sanjiv Kumar
 * | Created On- 07-06-2024
 * | Created for- File Upload And Get From DMS
 * | Status- done
 */

import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";
import { Request, Response } from "express";

// const dmsUrl = "https://aadrikainfomedia.com/dms/backend/document/upload";
// const DMS_GET =
//   "https://aadrikainfomedia.com/dms/backend/document/view-by-reference";


const dmsUrl = "https://jharkhandegovernance.com/dms/backend/document/upload";

const DMS_GET = "https://jharkhandegovernance.com/dms/backend/document/view-by-reference"

class DMSFileHandlerController {
  upload = async (
    req: Request,
    res: Response,
    apiId: string
  ): Promise<object> => {
    try {
      const file: any = req.file;
      const hashed = crypto
        .createHash("SHA256")
        .update(file?.buffer)
        .digest("hex");

      const formData = new FormData();
      formData.append("file", file?.buffer, file?.mimetype);
      formData.append("tags", file?.originalname.substring(0, 7));

      const headers = {
        "x-digest": hashed,
        token: "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0",
        folderPathId: 1,
        ...formData.getHeaders(),
      };

      const response = await axios.post(dmsUrl, formData, { headers });

      return res.status(200).json({
        status: true,
        message: "Uploaded Succesfully",
        "meta-data": {
          apiId,
          action: "POST",
          version: "1.0",
        },
        data: response.data.data,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error occured while uploading",
        "meta-data": {
          apiId,
          action: "POST",
          version: "1.0",
        },
      });
    }
  };

  getFile = async (
    req: Request,
    res: Response,
    apiId: string
  ): Promise<Response> => {
    try {
      const headers = {
        token: "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0",
      };
      const response = await axios.post(
        DMS_GET,
        { referenceNo: req.params.referenceNo },
        { headers }
      );

      return res.status(200).json({
        status: true,
        message: "Found Succesfully",
        "meta-data": {
          apiId,
          action: "POST",
          version: "1.0",
        },
        data: response.data.data,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error occured while getting",
        "meta-data": {
          apiId,
          action: "POST",
          version: "1.0",
        },
      });
    }
  };

  uploadAndGetUrl = async (
    req: Request,
     res: Response,
    apiId: string
  ): Promise<Response> => {
    try {
      const file: any = req.file;
      const hashed = crypto
        .createHash("SHA256")
        .update(file?.buffer)
        .digest("hex");

      const formData = new FormData();
      formData.append("file", file?.buffer, file?.mimetype);
      formData.append("tags", file?.originalname.substring(0, 7));

      const headers = {
        "x-digest": hashed,
        token: "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0",
        folderPathId: 1,
        ...formData.getHeaders(),
      };

      const response = await axios.post(dmsUrl, formData, { headers });
      const refNo = response.data.data.ReferenceNo;
      const resData: any = await axios.post(
        DMS_GET,
        { referenceNo: refNo },
        { headers: { token: headers.token } }
      );

      return res.status(200).json({
        status: true,
        message: "Found Succesfully",
        "meta-data": {
          apiId,
          action: "POST",
          version: "1.0",
        },
        data: resData.data.data.fullPath,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error occured while getting",
        "meta-data": {
          apiId,
          action: "POST",
          version: "1.0",
        },
      });
    }
  };
}

export default DMSFileHandlerController;
