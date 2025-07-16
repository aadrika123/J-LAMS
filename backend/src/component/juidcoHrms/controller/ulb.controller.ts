import { Request, Response, NextFunction } from "express";
import UlbMasternDao from "../dao/ulb.dao";

class UlbMasterController {
  private UlbMasterDao: UlbMasternDao;
  private initMsg: string;
  constructor() {
    this.UlbMasterDao = new UlbMasternDao();
    this.initMsg = "ULB";
  }


    
     get = async (
        req: Request,
        res: Response,
        next: NextFunction,
        apiId: string
    ): Promise<object> => {

        try {
            const data = await this.UlbMasterDao.get(req);
            return res.json({
                "status": true,
                "message": "Assets fetched Succesfully",
                "meta-data": {
                    apiId,
                    action: "GET",
                    version: "1.0",
                },
                data: data
            })
            
        } catch (error) {
              return res.json({
                "status": false,
                "message": "Error occured while fetching Assets",
                "meta-data": {
                    apiId,
                    action: "GET",
                    version: "1.0",
                },
            })
        }
    };
}

export default UlbMasterController;
