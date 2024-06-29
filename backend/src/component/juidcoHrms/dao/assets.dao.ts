/*
 | Author- Jaideep
* | Created for- Assests Data Management Dao
* | Status: open
*/

import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../util/generateRes";


const prisma = new PrismaClient();

class AssetsManagementDao {

    post = async (req: Request) => {
        const {
            type_of_assets,
            asset_sub_category_name,
            assets_category_type,
            khata_no,
            plot_no,
            ward_no,
            address,
            depreciation_method,
            apreciation_method,
            blue_print,
            ownership_doc,
            type_of_land,
            area,
            order_no,
            order_date,
            acquisition,
            from_whom_acquired,
            mode_of_acquisition
        } = req.body;

        const assetReq = await prisma.assets_list.create({
            data: {
                type_of_assets: type_of_assets,
                asset_sub_category_name: asset_sub_category_name,
                assets_category_type: assets_category_type,
                khata_no: khata_no,
                plot_no: plot_no,
                ward_no: ward_no,
                address: address,
                depreciation_method: depreciation_method,
                apreciation_method: apreciation_method,
                ownership_doc: ownership_doc,
                blue_print: blue_print,
                type_of_land: type_of_land,
                area: area,
                order_no: order_no,
                order_date: order_date,
                acquisition: acquisition,
                from_whom_acquired: from_whom_acquired,
                mode_of_acquisition: mode_of_acquisition
            }
        });
        return generateRes(assetReq);
    };

    getAll = async (req: Request) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string || '';
        const count = await prisma.assets_list.count();
        const totalPages = Math.ceil(count / limit);
        const filter = req.query.filter as string || '';
        const skip = (page - 1) * limit;

        try {
            const assetGet = await prisma.assets_list.findMany({
                skip: skip,
                take: limit,
                where: {
                    OR: search
                        ? [
                            {
                                type_of_assets: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                asset_sub_category_name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                khata_no: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                assets_category_type: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                area: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            }
                        ]
                        : undefined,
                    AND: filter ? {
                        assets_category_type: {
                            equals: filter,
                            mode: "insensitive",
                        },
                    } : undefined,

                },
                orderBy: {
                    created_at: 'desc'
                }
            });
            return generateRes({
                totalPages,
                count,
                page,
                data: assetGet,
            });
        } catch (err) {
            console.log(err);
        }

    };

    getAllbyId = async (req: Request) => {
        const id = Number(req.query.id)
        try {
            const assetGetbyId = await prisma.assets_list.findFirst({
                where: {
                    id: id
                }
            });
            return generateRes({
                data: assetGetbyId,
            });
        } catch (err) {
            console.log(err);
        }
    };

    deletebyId = async (req: Request) => {
        const id = Number(req.query.id)
        try {
            const assetGetbyId = await prisma.assets_list.delete({
                where: {
                    id: id
                }
            });
            return generateRes(assetGetbyId);
        } catch (err) {
            console.log(err);
        }
    };
 
    update = async (req: Request) => {
    const {
        type_of_assets,
        asset_sub_category_name,
        assets_category_type,
        khata_no,
        plot_no,
        ward_no,
        address,
        depreciation_method,
        apreciation_method,
        blue_print,
        ownership_doc,
        type_of_land,
        area,
        order_no,
        order_date,
        acquisition,
        from_whom_acquired,
        mode_of_acquisition,
        status
    } = req.body;

    const id = Number(req.query.id);

    try {
        const result = await prisma.$transaction(async (tx) => {
            const existingAsset = await tx.assets_list.findUnique({
                where: {
                    id
                }
            });

            if (!existingAsset) {
                throw new Error("Asset not found");
            }

            await tx.assets_list_change_log.create({
                data: {
                    assetId: id,
                    type_of_assets: existingAsset.type_of_assets,
                    asset_sub_category_name: existingAsset.asset_sub_category_name,
                    assets_category_type: existingAsset.assets_category_type,
                    khata_no: existingAsset.khata_no,
                    plot_no: existingAsset.plot_no,
                    ward_no: existingAsset.ward_no,
                    address: existingAsset.address,
                    depreciation_method: existingAsset.depreciation_method,
                    apreciation_method: existingAsset.apreciation_method,
                    blue_print: existingAsset.blue_print,
                    ownership_doc: existingAsset.ownership_doc,
                    type_of_land: existingAsset.type_of_land,
                    area: existingAsset.area,
                    order_no: existingAsset.order_no,
                    order_date: existingAsset.order_date,
                    acquisition: existingAsset.acquisition,
                    from_whom_acquired: existingAsset.from_whom_acquired,
                    mode_of_acquisition: existingAsset.mode_of_acquisition,
                    status: existingAsset.status
                }
            });

            let updatedAsset = null;

            if (status === 1) {
                updatedAsset = await tx.assets_list.update({
                    where: {
                        id
                    },
                    data: {
                        type_of_assets,
                        asset_sub_category_name,
                        assets_category_type,
                        khata_no,
                        plot_no,
                        ward_no,
                        address,
                        depreciation_method,
                        apreciation_method,
                        ownership_doc,
                        blue_print,
                        type_of_land,
                        area,
                        order_no,
                        order_date,
                        acquisition,
                        from_whom_acquired,
                        mode_of_acquisition,
                        status
                    }
                });

                await tx.asset_update_req.updateMany({
                    where: {
                        assetId: id,
                        status: 0
                    },
                    data: {
                        status: 1
                    }
                });

            } else if (status === -1) {
                console.error("rejected");
                await tx.asset_update_req.updateMany({
                    where: {
                        assetId: id,
                        status: 0
                    },
                    data: {
                        status: -1
                    }
                });

                updatedAsset = await tx.assets_list.update({
                    where: {
                        id,
                    },
                    data: {
                        type_of_assets,
                        asset_sub_category_name,
                        assets_category_type,
                        khata_no,
                        plot_no,
                        ward_no,
                        address,
                        depreciation_method,
                        apreciation_method,
                        ownership_doc,
                        blue_print,
                        type_of_land,
                        area,
                        order_no,
                        order_date,
                        acquisition,
                        from_whom_acquired,
                        mode_of_acquisition,
                        status
                    }
                });
            } else if (status === 0) {
                console.error("waiting for approval");
                return await tx.asset_update_req.create({
                    data: {
                        assetId: id,
                        type_of_assets,
                        asset_sub_category_name,
                        assets_category_type,
                        khata_no,
                        plot_no,
                        ward_no,
                        address,
                        depreciation_method,
                        apreciation_method,
                        blue_print,
                        ownership_doc,
                        type_of_land,
                        area,
                        order_no,
                        order_date,
                        acquisition,
                        from_whom_acquired,
                        mode_of_acquisition,
                        status
                    }
                });
            }
            console.error("approved/rejected");
            return updatedAsset;
        });

        return generateRes(result);
    } catch (error) {
        console.error(error);
    }
};

     getAllUpdated = async (req: Request) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string || '';
        const count = await prisma.assets_list.count();
        const totalPages = Math.ceil(count / limit);
        const filter = req.query.filter as string || '';
        const skip = (page - 1) * limit;

        try {
            const assetGet = await prisma.asset_update_req.findMany({
                skip: skip,
                take: limit,
                where: {
                    OR: search
                        ? [
                            {
                                type_of_assets: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                asset_sub_category_name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                khata_no: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                assets_category_type: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                area: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            }
                        ]
                        : undefined,
                    AND: filter ? {
                        assets_category_type: {
                            equals: filter,
                            mode: "insensitive",
                        },
                    } : undefined,

                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return generateRes({
                totalPages,
                count,
                page,
                data: assetGet,
            });
        } catch (err) {
            console.log(err);
        }

    };

    // update = async (req: Request) => {
    //     const {
    //         type_of_assets,
    //         asset_sub_category_name,
    //         assets_category_type,
    //         khata_no,
    //         plot_no,
    //         ward_no,
    //         address,
    //         depreciation_method,
    //         apreciation_method,
    //         blue_print,
    //         ownership_doc,
    //         type_of_land,
    //         area,
    //         order_no,
    //         order_date,
    //         acquisition,
    //         from_whom_acquired,
    //         mode_of_acquisition
    //     } = req.body;

    //     const id = Number(req.query.id)

    //     const assetReq = await prisma.assets_list.update({
    //         where: {
    //             id: id
    //         },
    //         data: {
    //             type_of_assets: type_of_assets,
    //             asset_sub_category_name: asset_sub_category_name,
    //             assets_category_type: assets_category_type,
    //             khata_no: khata_no,
    //             plot_no: plot_no,
    //             ward_no: ward_no,
    //             address: address,
    //             depreciation_method: depreciation_method,
    //             apreciation_method: apreciation_method,
    //             ownership_doc: ownership_doc,
    //             blue_print: blue_print,
    //             type_of_land: type_of_land,
    //             area: area,
    //             order_no: order_no,
    //             order_date: order_date,
    //             acquisition: acquisition,
    //             from_whom_acquired: from_whom_acquired,
    //             mode_of_acquisition: mode_of_acquisition
    //         }
    //     });
    //     return generateRes(assetReq);
    // };

}

export default AssetsManagementDao;
