/**
 * | Author- Jaideep
 * | Created for- Assests Data Management Controller
 * | Status: open
 */

import { NextFunction, Request, Response } from "express";
import AssetsManagementDao from "../dao/assets.dao";

class AssetManagementController {
    private assetsManagementDao: AssetsManagementDao;
    private initMesg: string;

    constructor() {
        this.assetsManagementDao = new AssetsManagementDao();
        this.initMesg = "Asset Added";
    }

    create = async (
        req: Request,
        res: Response,
        next: NextFunction,
        apiId: string
    ): Promise<object> => {

        try {
            const data = await this.assetsManagementDao.post(req);
            return res.json({
                "status": true,
                "message": "Assets added Succesfully",
                "meta-data": {
                    apiId,
                    action: "POST",
                    version: "1.0",
                },
                data: data
            })

        } catch (error) {
              return res.json({
                "status": false,
                "message": "Error occured while saving Assets",
                "meta-data": {
                    apiId,
                    action: "POST",
                    version: "1.0",
                },
            })
        }
    };

    getAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
        apiId: string
    ): Promise<object> => {

        try {
            const data = await this.assetsManagementDao.getAll(req);
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

    getAllbyId = async (
        req: Request,
        res: Response,
        next: NextFunction,
        apiId: string
    ): Promise<object> => {

        try {
            const data = await this.assetsManagementDao.getAllbyId(req);
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


    deleteAllbyId = async (
        req: Request,
        res: Response,
        next: NextFunction,
        apiId: string
    ): Promise<object> => {

        try {
            const data = await this.assetsManagementDao.deletebyId(req);
            return res.json({
                "status": true,
                "message": "Assets Data deleted Succesfully",
                "meta-data": {
                    apiId,
                    action: "DELETE",
                    version: "1.0",
                },
                data: data
            })
            
        } catch (error) {
              return res.json({
                "status": false,
                "message": "Error occured while deleting Assets",
                "meta-data": {
                    apiId,
                    action: "DELETE",
                    version: "1.0",
                },
            })
        }
    };

    updatebyId = async (
        req: Request,
        res: Response,
        next: NextFunction,
        apiId: string
    ): Promise<object> => {

        try {
            const data = await this.assetsManagementDao.update(req);
            return res.json({
                // "status": true,
                                    status: 201,

                "message": "Assets Data Updated Succesfully",
                "meta-data": {
                    apiId,
                    action: "POST",
                    version: "1.0",
                },
                data: data
            })
            
        } catch (error) {
              return res.json({
                "status": false,
                "message": "Error occured while Updating Assets",
                "meta-data": {
                    apiId,
                    action: "POST",
                    version: "1.0",
                },
            })
        }
    };

   


}

export default AssetManagementController;
