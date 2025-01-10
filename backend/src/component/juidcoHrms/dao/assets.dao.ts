/*
 | Author- Jaideep
* | Created for- Assests Data Management Dao
* | Status: open
*/

import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { generateRes } from "../../../util/generateRes";
import NotificationsDao from "./notifications.dao";


const prisma = new PrismaClient();

class AssetsManagementDao {

    // post = async (req: Request) => {
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
    //         mode_of_acquisition,
    //         role
    //     } = req.body;

    //     try {
    //         const result = await prisma.$transaction(async (tx) => {
    //             const assetReq = await tx.assets_list.create({
    //                 data: {
    //                     type_of_assets,
    //                     asset_sub_category_name,
    //                     assets_category_type,
    //                     khata_no,
    //                     plot_no,
    //                     ward_no,
    //                     address,
    //                     depreciation_method,
    //                     apreciation_method,
    //                     ownership_doc,
    //                     blue_print,
    //                     type_of_land,
    //                     area,
    //                     order_no,
    //                     order_date,
    //                     acquisition,
    //                     from_whom_acquired,
    //                     mode_of_acquisition,
    //                     role,
    //                     status: 0
    //                 }
    //             });

    //             console.log("assetReq", assetReq)

    //             await tx.asset_fieldOfficer_req.create({
    //                 data: {
    //                     assetId: assetReq?.id,
    //                 },
    //             });

    //             await tx.asset_checker_req.create({
    //                 data: {
    //                     assetId: assetReq?.id,
    //                 },
    //             });

    //             return assetReq;
    //         });

    //         return (generateRes(result));
    //     } catch (error) {
    //         console.error('Error processing request:', error);
    //         throw { error: 400, msg: "duplicate" }
    //     }
    // }

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
            mode_of_acquisition,
            role,
            floorData,
            no_of_floors,
            building_name,
            ulb_id,
            location
        } = req.body;

        const notificationsDao = new NotificationsDao();

        try {
            const result = await prisma.$transaction(async (tx) => {
                const lastAsset = await tx.assets_list.findFirst({
                    orderBy: {
                        created_at: 'desc',
                    },
                    select: {
                        id: true,
                    },
                });

                const numericMatch = String(lastAsset?.id)?.match(/(\d{3})$/);
                const lastId = numericMatch ? Number(numericMatch[0]) : 0;
                const newIncrementId = lastId + 1;
                const formattedIds = newIncrementId.toString().padStart(3, '0');

                const validUlbId = ulb_id ? String(ulb_id).trim() : '';
                const validAssetType = type_of_assets ? type_of_assets.toLowerCase().trim() : '';

                const formattedId = validUlbId && validAssetType
                    ? `${validUlbId}${validAssetType}${formattedIds}`
                    : 'invalid-id';

                const existingAsset = await tx.assets_list.findUnique({
                    where: { id: formattedId },
                });

                if (existingAsset) {
                    throw new Error(`Asset with ID ${formattedId} already exists`);
                }

                const assetReq = await tx.assets_list.create({
                    data: {
                        id: formattedId,
                        type_of_assets,
                        asset_sub_category_name,
                        assets_category_type,
                        khata_no,
                        plot_no,
                        ward_no,
                        address,
                        building_name: building_name,
                        ulb_id: ulb_id,
                        depreciation_method,
                        location,
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
                        role,
                        no_of_floors,
                        status: 0,
                        floorData: {
                            create: floorData.map((floor: any) => ({
                                floor: floor.floor,
                                plotCount: floor.plotCount,
                                type: floor.type,
                                details: {
                                    create: floor.details.map((detail: any) => ({
                                        index: detail.index,
                                        type: detail.type,
                                        length: detail.length ? String(detail.length) : null,
                                        breadth: detail.breadth ? String(detail.breadth) : null,
                                        height: detail.height ? String(detail.height) : null,
                                        name: detail.name,
                                        property_name: detail.property_name,
                                        type_of_plot: detail.type_of_plot
                                    }))
                                }
                            }))
                        }
                    }
                });

                await tx.asset_fieldOfficer_req.create({
                    data: {
                        assetId: assetReq?.id,
                    },
                });

                await tx.asset_checker_req.create({
                    data: {
                        assetId: assetReq?.id,
                    },
                });

                const existingLocation = await tx.location.findFirst({
                    where: { location: location },
                });

                if (existingLocation) {
                    if (!existingLocation.building_name || !existingLocation.address) {
                        const updatedLocation = await tx.location.update({
                            where: { id: existingLocation.id },
                            data: {
                                building_name: existingLocation.building_name || req.body.building_name || "",
                                address: existingLocation.address || req.body.address || "",
                                updated_at: new Date(),
                            },
                        });
                    }
                } else {
                    // If location doesn't exist, create a new entry
                    const newLocation = await tx.location.create({
                        data: {
                            location: location || '',
                            ulb_id: ulb_id,
                            building_name: req.body.building_name || '',
                            address: req.body.address || '',
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                }
                // Create a notification for the newly created asset
                await notificationsDao.createNotification(assetReq.id, 0, role);

                return assetReq;
            });



            return generateRes(result);

        } catch (error) {
            console.error('Error processing request:', error);
            throw { error: 400, msg: "duplicate" }
        }
    };

    postWithModifiedId =  async (req: Request) => {
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
            role,
            floorData,
            no_of_floors,
            building_name,
            ulb_id,
            location,
        } = req.body;
    
        const { assets_id } = req.query;
        const assetId = Array.isArray(assets_id) ? assets_id[0] : assets_id;
    
        if (typeof assetId !== 'string') {
            throw new Error("Invalid assets_id. It must be a string.");
        }
    
        const notificationsDao = new NotificationsDao();
    
        try {
            const result = await prisma.$transaction(async (tx) => {
                // Find the next version of the asset ID
                const existingAssets = await tx.assets_list.findMany({
                    where: {
                        id: {
                            startsWith: assetId,
                        },
                    },
                    select: { id: true },
                });
    
                const maxVersion = existingAssets
                    .map((asset) => {
                        const parts = asset.id.split('-');
                        return parts.length > 1 ? parseInt(parts[1], 10) : 0;
                    })
                    .reduce((max, current) => Math.max(max, current), 0);
    
                const newAssetsId = `${assetId}-${maxVersion + 1}`;
    
                // Ensure the new ID doesn't already exist
                const existingAsset = await tx.assets_list.findUnique({
                    where: { id: newAssetsId },
                });
    
                if (existingAsset) {
                    throw new Error(`Asset with ID ${newAssetsId} already exists`);
                }
    
                const assetReq = await tx.assets_list.create({
                    data: {
                        id: newAssetsId,
                        type_of_assets,
                        asset_sub_category_name,
                        assets_category_type,
                        khata_no,
                        plot_no,
                        ward_no,
                        address,
                        building_name,
                        ulb_id,
                        depreciation_method,
                        location,
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
                        role,
                        no_of_floors,
                        status: 0,
                        is_restructured: true, // Add is_restructured field
                        floorData: {
                            create: floorData.map((floor: any) => ({
                                floor: floor.floor,
                                plotCount: floor.plotCount,
                                type: floor.type,
                                details: {
                                    create: floor.details.map((detail: any) => ({
                                        index: detail.index,
                                        type: detail.type,
                                        length: detail.length ? String(detail.length) : null,
                                        breadth: detail.breadth ? String(detail.breadth) : null,
                                        height: detail.height ? String(detail.height) : null,
                                        name: detail.name,
                                        property_name: detail.property_name,
                                        type_of_plot: detail.type_of_plot,
                                    })),
                                },
                            })),
                        },
                    },
                });
    
                await tx.asset_fieldOfficer_req.create({
                    data: {
                        assetId: assetReq.id,
                    },
                });
    
                await tx.asset_checker_req.create({
                    data: {
                        assetId: assetReq.id,
                    },
                });
    
                const existingLocation = await tx.location.findFirst({
                    where: { location },
                });
    
                if (existingLocation) {
                    if (!existingLocation.building_name || !existingLocation.address) {
                        await tx.location.update({
                            where: { id: existingLocation.id },
                            data: {
                                building_name: existingLocation.building_name || building_name || '',
                                address: existingLocation.address || address || '',
                                updated_at: new Date(),
                            },
                        });
                    }
                } else {
                    await tx.location.create({
                        data: {
                            location: location || '',
                            ulb_id: ulb_id,
                            building_name: building_name || '',
                            address: address || '',
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                }
    
                // Create a notification for the newly created asset
                await notificationsDao.createNotification(assetReq.id, 0, role);
    
                return assetReq;
            });
    
            return generateRes(result);
        } catch (error) {
            console.error('Error processing request:', error);
            throw { error: 400, msg: "duplicate" };
        }
    };
    
    


    // post = async (req: Request) => {
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
    //         mode_of_acquisition,
    //         status
    //     } = req.body;

    //     const result = await prisma.$transaction(async (tx) => {

    //         await tx.asset_fieldOfficer_req.update({
    //                 where: {
    //                         assetId: id,
    //                         assets_list: {
    //                             status:0
    //                         }
    //             },
    //             data: {
    //                 status: 0
    //             }
    //         });

    //         if (status === 0) {
    //         try {
    //         const assetReq = await tx.assets_list.create({
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
    //             mode_of_acquisition: mode_of_acquisition,
    //             status:status
    //         }
    //         });
    //         return generateRes(assetReq);

    //         } catch (err) {
    //             console.log("err", err)
    //         }

    //     } else if (status === -1) {
    //         try {
    //         const assetReq = await tx.assets_list.create({
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
    //             mode_of_acquisition: mode_of_acquisition,
    //             status:status
    //         }
    //         });
    //         return generateRes(assetReq);
    //         }
    //         catch(err) {
    //           console.log("err", err)
    //         }}
    //     })

    //     return generateRes(result);
    // };

    // getAll = async (req: Request) => {

    //     const page = Number(req.query.page) || 1;
    //     const limit = Number(req.query.limit) || 10;
    //     const search = req.query.search as string || '';
    //     const count = await prisma.assets_list.count();
    //     const totalPages = Math.ceil(count / limit);
    //     const filter = req.query.filter as string || '';
    //     const skip = (page - 1) * limit;
    //     const status1Items = await prisma.assets_list.count({
    //         where: {
    //             status: 2,
    //         },
    //     });
    //     const statusMinus1Items = await prisma.assets_list.count({
    //         where: {
    //             status: -2,
    //         },
    //     });
    //     const statusPendingAssets = await prisma.assets_list.count({
    //         where: {
    //             status: 1,
    //         },
    //     });

    //     try {
    //         const assetGet = await prisma.assets_list.findMany({
    //             skip: skip,
    //             take: limit,
    //             where: {
    //                 OR: search
    //                     ? [
    //                         {
    //                             type_of_assets: {
    //                                 contains: search,
    //                                 mode: "insensitive",
    //                             },
    //                         },
    //                         {
    //                             asset_sub_category_name: {
    //                                 contains: search,
    //                                 mode: "insensitive",
    //                             },
    //                         },
    //                         {
    //                             khata_no: {
    //                                 contains: search,
    //                                 mode: "insensitive",
    //                             },
    //                         },
    //                         {
    //                             assets_category_type: {
    //                                 contains: search,
    //                                 mode: "insensitive",
    //                             },
    //                         },
    //                         {
    //                             area: {
    //                                 contains: search,
    //                                 mode: "insensitive",
    //                             },
    //                         }
    //                     ]
    //                     : undefined,
    //                 AND: filter ? {
    //                     assets_category_type: {
    //                         equals: filter,
    //                         mode: "insensitive",
    //                     },
    //                 } : undefined,

    //             },
    //             include: {
    //             floorData: {
    //                 include: {
    //                     details: true,
    //                 },
    //             },
    //         },
    //             orderBy: {
    //                 created_at: 'desc'
    //             }
    //         });
    //         return generateRes({
    //             totalPages,
    //             count,
    //             status1Items,
    //             statusMinus1Items,
    //             statusPendingAssets,
    //             page,
    //             data: assetGet,
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     }

    // };


    getAll = async (req: Request) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string || '';
        const filter = req.query.filter as string || '';
        console.log(req.body.auth);
        const { ulb_id } = req.body.auth || 2;
        // const id =  Number(req.query.id) || 1;

        const status = Number(req.query.status)
        const land = req.query.land as string || ''
        const skip = (page - 1) * limit;
        const status1Items = await prisma.assets_list.count({
            where: {
                status: 2,
            },
        });
        const statusMinus1Items = await prisma.assets_list.count({
            where: {
                status: -2,
            },
        });
        const statusPendingAssets = await prisma.assets_list.count({
            where: {
                status: 1,
            },
        });

        try {

            const count = await prisma.assets_list.count({

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
                                ward_no: {
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
                    ulb_id: ulb_id,
                    AND: [
                        filter ? {
                            OR: [
                                {
                                    assets_category_type: {
                                        equals: filter,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    type_of_assets: {
                                        equals: filter,
                                        mode: "insensitive",
                                    },
                                },
                            ],
                        } : {},
                        (status === 0 || status) ? {
                            status: {
                                equals: status,
                            },
                        } : {},
                        land ? {
                            type_of_land: {
                                equals: land,
                                mode: "insensitive",
                            },
                        } : {},
                    ]



                },
                // ...(search && {
                //     OR: [
                //         { type_of_assets: { contains: search, mode: "insensitive" } },
                //         { asset_sub_category_name: { contains: search, mode: "insensitive" } },
                //         { khata_no: { contains: search, mode: "insensitive" } },
                //         { assets_category_type: { contains: search, mode: "insensitive" } },
                //         { area: { contains: search, mode: "insensitive" } },
                //     ],
                // }),
                // ...(filter && {
                //     OR: [
                //         {assets_category_type: { equals: filter,mode: "insensitive", },},
                //         { type_of_assets: {  equals: filter,  mode: "insensitive", },
                //         },
                //     ],
                // }),
                // ...(status !== undefined && {
                //     status: { equals: status },
                // }),
                // ...(land && {
                //     type_of_land: { equals: land, mode: "insensitive" },
                // }),
            });

            const totalPages = Math.ceil(count / limit);

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
                                ward_no: {
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
                    ulb_id: ulb_id,
                    AND: [
                        filter ? {
                            OR: [
                                {
                                    assets_category_type: {
                                        equals: filter,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    type_of_assets: {
                                        equals: filter,
                                        mode: "insensitive",
                                    },
                                },
                            ],
                        } : {},
                        (status === 0 || status) ? {
                            status: {
                                equals: status,
                            },
                        } : {},
                        land ? {
                            type_of_land: {
                                equals: land,
                                mode: "insensitive",
                            },
                        } : {},
                    ]



                },
                include: {
                    floorData: {
                        include: {
                            details: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
            return generateRes({
                totalPages,
                count,
                status1Items,
                statusMinus1Items,
                statusPendingAssets,
                page,
                data: assetGet,
            });
        } catch (err) {
            console.log(err);
        }

    };


    getRestructuredAssets = async (req: Request) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string || '';
        const filter = req.query.filter as string || '';
        const { ulb_id } = req.body.auth || 2; // Ensure a valid `ulb_id` is provided
        const skip = (page - 1) * limit;
    
        try {
            const count = await prisma.assets_list.count({
                where: {
                    is_restructured: true, // Only restructured assets
                    OR: search
                        ? [
                            { type_of_assets: { contains: search, mode: "insensitive" } },
                            { asset_sub_category_name: { contains: search, mode: "insensitive" } },
                            { khata_no: { contains: search, mode: "insensitive" } },
                            { ward_no: { contains: search, mode: "insensitive" } },
                            { assets_category_type: { contains: search, mode: "insensitive" } },
                            { area: { contains: search, mode: "insensitive" } },
                        ]
                        : undefined,
                    ulb_id: ulb_id,
                    AND: filter ? {
                        OR: [
                            { assets_category_type: { equals: filter, mode: "insensitive" } },
                            { type_of_assets: { equals: filter, mode: "insensitive" } },
                        ],
                    } : undefined,
                },
            });
    
            const totalPages = Math.ceil(count / limit);
    
            const assets = await prisma.assets_list.findMany({
                skip: skip,
                take: limit,
                where: {
                    is_restructured: true, // Only restructured assets
                    OR: search
                        ? [
                            { type_of_assets: { contains: search, mode: "insensitive" } },
                            { asset_sub_category_name: { contains: search, mode: "insensitive" } },
                            { khata_no: { contains: search, mode: "insensitive" } },
                            { ward_no: { contains: search, mode: "insensitive" } },
                            { assets_category_type: { contains: search, mode: "insensitive" } },
                            { area: { contains: search, mode: "insensitive" } },
                        ]
                        : undefined,
                    ulb_id: ulb_id,
                    AND: filter ? {
                        OR: [
                            { assets_category_type: { equals: filter, mode: "insensitive" } },
                            { type_of_assets: { equals: filter, mode: "insensitive" } },
                        ],
                    } : undefined,
                },
                include: {
                    floorData: {
                        include: {
                            details: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            });
    
            return generateRes({
                totalPages,
                count,
                page,
                data: assets,
            });
        } catch (error) {
            console.error(error);
            throw new Error("Error fetching restructured assets");
        }
    };
    
    
    getAllbyId = async (req: Request) => {
        const id = String(req.query.id)
        try {
            const assetGetbyId = await prisma.assets_list.findFirst({
                where: {
                    id: id
                },
                include: {
                    floorData: {
                        include: {
                            details: true,
                        },
                    },
                },
            });
            return generateRes({
                data: assetGetbyId,
            });
        } catch (err) {
            console.log(err);
        }
    };

    deletebyId = async (req: Request) => {
        const id = String(req.query.id)
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
            status,
            // floorData
            floorData = []
        } = req.body;

        const id = String(req.query.id);
        const notificationsDao = new NotificationsDao();

        try {
            const result = await prisma.$transaction(async (tx) => {
                const existingAsset: any = await tx.assets_list.findUnique({
                    where: {
                        id
                    },
                    include: {
                        floorData: {
                            include: {
                                details: true
                            }
                        }
                    }
                });

                console.log("existingAsset", existingAsset)

                if (!existingAsset) {
                    console.log("Asset not found");
                    throw new Error("Asset not found");
                }

                // Log change in status to notifications
                if (existingAsset.status !== status) {
                    await notificationsDao.createNotification(id, status, existingAsset.role);
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
                        status: Number(existingAsset.status),
                        role: existingAsset.role,
                    }
                });

                const updatedAsset = await tx.assets_list.update({
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
                        status: Number(status),
                    }
                });

                const existingFloorData = existingAsset.floorData;
                const existingFloorIds = existingFloorData?.map((floor: any) => floor.id);
                const incomingFloorIds = floorData?.map((floor: any) => floor.id);

                await tx.floorData.deleteMany({
                    where: {
                        id: {
                            in: existingFloorIds.filter((id: any) => !incomingFloorIds?.includes(id))
                        }
                    }
                });

                for (const floor of floorData) {
                    if (existingFloorIds?.includes(floor.id)) {
                        await tx.floorData?.update({
                            where: {
                                id: floor?.id
                            },
                            data: {
                                floor: floor?.floor,
                                plotCount: floor?.plotCount,
                                type: floor?.type,
                                details: {
                                    deleteMany: {
                                        floorDataId: floor?.id
                                    },
                                    create: floor.details.map((detail: any) => ({
                                        index: detail?.index,
                                        type: detail?.type,
                                        length: detail?.length,
                                        breadth: detail?.breadth,
                                        height: detail?.height,
                                        name: detail?.name,
                                        property_name: detail?.property_name,
                                        type_of_plot: detail?.type_of_plot
                                    }))
                                }
                            }
                        });
                    } else {
                        await tx.floorData.create({
                            data: {
                                floor: floor.floor,
                                plotCount: floor.plotCount,
                                type: floor.type,
                                assetsListId: id,
                                details: {
                                    create: floor.details.map((detail: any) => ({
                                        index: detail.index,
                                        type: detail.type,
                                        length: detail.length,
                                        breadth: detail.breadth,
                                        height: detail.height,
                                        name: detail.name,
                                        property_name: detail.property_name,
                                        type_of_plot: detail.type_of_plot
                                    }))
                                }
                            }
                        });
                    }
                }

                if (status === 1) {
                    await tx.asset_fieldOfficer_req.update({
                        where: {
                            assetId: id
                        },
                        data: {
                            long: req.body.long,
                            lat: req.body.lat,
                            remarks: req.body.remarks,
                            image_one: req.body.image_one,
                            image_two: req.body.image_two,
                            image_three: req.body.image_three,
                            image_four: req.body.image_four,
                            image_five: req.body.image_five
                        }
                    });
                }

                const existence: number = await prisma.asset_checker_req.count({
                    where: {
                        assetId: id
                    }
                });

                if (existence === 0 || status === 2 || status === -2) {
                    await tx.asset_checker_req.update({
                        where: {
                            assetId: updatedAsset?.id
                        },
                        data: {
                            checker_remarks: req.body.checker_remarks
                        }
                    });
                }

                return updatedAsset;
            });

            console.log("result", result);
            return generateRes(result);
        } catch (error: any) {
            console.error("err", error);
            return error;
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
    //         mode_of_acquisition,
    //         status,
    //         floorData

    //     } = req.body;

    //     const id = Number(req.query.id);

    //     try {
    //         const result = await prisma.$transaction(async (tx) => {
    //             const existingAsset: any = await tx.assets_list.findUnique({
    //                 where: {
    //                     id
    //                 }
    //             });
    //             console.log("existingAsset", existingAsset)

    //             if (!existingAsset) {
    //                 console.log("Asset not found");
    //             }

    //             await tx.assets_list_change_log.create({
    //                 data: {
    //                     assetId: id,
    //                     type_of_assets: existingAsset.type_of_assets,
    //                     asset_sub_category_name: existingAsset.asset_sub_category_name,
    //                     assets_category_type: existingAsset.assets_category_type,
    //                     khata_no: existingAsset.khata_no,
    //                     plot_no: existingAsset.plot_no,
    //                     ward_no: existingAsset.ward_no,
    //                     address: existingAsset.address,
    //                     depreciation_method: existingAsset.depreciation_method,
    //                     apreciation_method: existingAsset.apreciation_method,
    //                     blue_print: existingAsset.blue_print,
    //                     ownership_doc: existingAsset.ownership_doc,
    //                     type_of_land: existingAsset.type_of_land,
    //                     area: existingAsset.area,
    //                     order_no: existingAsset.order_no,
    //                     order_date: existingAsset.order_date,
    //                     acquisition: existingAsset.acquisition,
    //                     from_whom_acquired: existingAsset.from_whom_acquired,
    //                     mode_of_acquisition: existingAsset.mode_of_acquisition,
    //                     status: Number(existingAsset.status),
    //                     role: existingAsset.role,

    //                 }
    //             });

    //             const updatedAsset = await tx.assets_list.update({
    //                 where: {
    //                     id
    //                 },
    //                 data: {
    //                     type_of_assets,
    //                     asset_sub_category_name,
    //                     assets_category_type,
    //                     khata_no,
    //                     plot_no,
    //                     ward_no,
    //                     address,
    //                     depreciation_method,
    //                     apreciation_method,
    //                     ownership_doc,
    //                     blue_print,
    //                     type_of_land,
    //                     area,
    //                     order_no,
    //                     order_date,
    //                     acquisition,
    //                     from_whom_acquired,
    //                     mode_of_acquisition,
    //                     status: Number(status),
    //                     floorData: {
    //                     create: floorData.map((floor:any) => ({
    //                         floor: floor.floor,
    //                         plotCount: floor.plotCount,
    //                         type: floor.type,
    //                         details: {
    //                             create: floor.details.map((detail:any) => ({
    //                                 index: detail.index,
    //                                 type: detail.type,
    //                                 length: detail.length,
    //                                 breadth: detail.breadth,
    //                                 height: detail.height,
    //                                 name: detail.name,
    //                                 property_name: detail.property_name,
    //                                 type_of_plot:detail.type_of_plot
    //                             }))
    //                         }
    //                     }))
    //                 }
    //                 }
    //             });

    //             if (status === 1) {
    //                 await tx.asset_fieldOfficer_req.update({
    //                     where: {
    //                         assetId: id
    //                     },
    //                     data: {
    //                         long: req.body.long,
    //                         lat: req.body.lat,
    //                         remarks: req.body.remarks,
    //                         image: req.body.image
    //                     }
    //                 })
    //             }

    //             const existence: number = await prisma.asset_checker_req.count({
    //                 where: {
    //                     assetId: id
    //                 }
    //             })

    //             if (existence === 0 || status === 2 || status === -2) {
    //                     await tx.asset_checker_req.update({
    //                         where: {
    //                             assetId: updatedAsset?.id
    //                         },
    //                         data: {
    //                             checker_remarks: req.body.checker_remarks
    //                         },
    //                     })
    //             }

    //             console.error("approved/rejected");
    //             return updatedAsset;
    //         });
    //         console.log("result", result)
    //         return generateRes(result);

    //     } catch (error: any) {
    //         console.error("err", error);
    //         return error
    //     }
    // };

    getAllFieldOfficer = async (req: Request) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const count = await prisma.asset_fieldOfficer_req.count();
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const id = String(req.query.id)


        try {
            const assetGet = await prisma.asset_fieldOfficer_req.findMany({
                skip: skip,
                take: limit,
                where: {
                    assetId: id
                },
                select: {
                    id: true,
                    asset: true,
                    long: true,
                    lat: true,
                    remarks: true,
                    image_one: true,
                    image_two: true,
                    image_three: true,
                    image_four: true,
                    image_five: true



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

    getAllCheckerData = async (req: Request) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const count = await prisma.asset_checker_req.count();
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;
        const id = String(req.query.id)

        try {
            const assetGet = await prisma.asset_checker_req.findMany({
                skip: skip,
                take: limit,
                where: {
                    assetId: id
                },
                select: {
                    id: true,
                    checker_remarks: true,
                    // assetId:true
                    // fieldOfficer: true,
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


    getAllAuditData = async (req: Request) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string || '';
        const count = await prisma.assets_list_change_log.count();
        const totalPages = Math.ceil(count / limit);
        const filter = req.query.filter as string || '';
        const skip = (page - 1) * limit;

        try {
            const assetGet = await prisma.assets_list_change_log.findMany({
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


    // csv data

    getcsvdatall = async (req: Request) => {
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search as string || '';


        const filter = req.query.filter as string || '';
        const id = Number(req.query.id) || 1;

        const status = Number(req.query.status)
        const land = req.query.land as string || ''
        const status1Items = await prisma.assets_list.count({
            where: {
                status: 2,
            },
        });
        const statusMinus1Items = await prisma.assets_list.count({
            where: {
                status: -2,
            },
        });
        const statusPendingAssets = await prisma.assets_list.count({
            where: {
                status: 1,
            },
        });

        try {


            const assetGet = await prisma.assets_list.findMany({
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
                    ulb_id: id,
                    AND: [
                        filter ? {
                            OR: [
                                {
                                    assets_category_type: {
                                        equals: filter,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    type_of_assets: {
                                        equals: filter,
                                        mode: "insensitive",
                                    },
                                },
                            ],
                        } : {},
                        (status === 0 || status) ? {
                            status: {
                                equals: status,
                            },
                        } : {},
                        land ? {
                            type_of_land: {
                                equals: land,
                                mode: "insensitive",
                            },
                        } : {},
                    ]



                },
                include: {
                    floorData: {
                        include: {
                            details: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
            return generateRes({
                status1Items,
                statusMinus1Items,
                statusPendingAssets,
                data: assetGet,
            });
        } catch (err) {
            console.log(err);
        }

    };



    // marketcircle = async (req: Request) => {
    //     const id =  Number(req.query.id) || 1;
    //     try {
    //         const circleGet = await prisma.circle.findMany({
    //             where: {
    //                 ulb_id: id,
    //             },
    //             orderBy: {
    //                 created_at: 'desc'
    //             }
    //         });
    //         const circleGets = await prisma.assets_list.findMany({
    //             where: {
    //                 ulb_id: id,
    //             },
    //             orderBy: {
    //                 created_at: 'desc'
    //             }
    //         });
    //         console.log("circleGets",circleGets)
    //         return generateRes({
    //             data: circleGet,
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     }

    // };


    locationselect = async (req: Request) => {
        const id = req.query.id ? Number(req.query.id) : null;
    
        try {
            // Fetch circle data
            const circleGet = await prisma.location.findMany({
                where: id !== null ? { ulb_id: id } : undefined, // Conditional where clause
                orderBy: {
                    created_at: 'desc',
                },
            });
    
            return generateRes({
                data: circleGet,
            });
    
        } catch (err) {
            console.error("Error fetching market circle data:", err);
            return generateRes({
                data: [],  // Return empty data on error
                message: 'Error fetching market circle data',
            });
        }
    };

    getBuildingNameByLocation = async (req: Request) => {
        const locationId = req.query.location_id ? Number(req.query.location_id) : undefined;
    
        try {
            const assets = await prisma.assets_list.findMany({
                where: {
                    location_id: locationId,
                },
                select: {
                    location_id: true,
                    location: true,
                    id: true, 
                    building_name: true,
                    address: true,
                    ulb_id: true,
                },
            });
    
            // Transform the assets to rename 'id' to 'building_id'
            const transformedAssets = assets.map(asset => ({
                ...asset,
                building_id: asset.id,
                id: undefined, // Optionally remove the original 'id' field
            }));
    
            return generateRes({
                data: transformedAssets || [],
            });
    
        } catch (err) {
            console.error("Error fetching building name by location:", err);
            return generateRes({
                data: [],
                message: 'Error fetching building name by location',
            });
        }
    };
    


    //   marketcircle = async (req: Request) => {
    //     const page = Number(req.query.page) || 1; 
    //     const limit = Number(req.query.limit) || 5; 
    //     const id = Number(req.query.id) || 1;

    //     const skip = (page - 1) * limit;

    //     try {
    //         const circleGet = await prisma.location.findMany({
    //             where: {
    //                 ulb_id: id,
    //             },
    //             orderBy: {
    //                 created_at: 'desc', 
    //             },
    //             skip: skip,      
    //             take: limit,   
    //         });


    //         const circleGets = await prisma.assets_list.findMany({
    //             where: {
    //                 ulb_id: id,
    //             },
    //             select: {
    //                 location: true,
    //                 id: true,
    //                 ulb_id: true,
    //                 building_name: true,
    //                 address: true
    //             },
    //             orderBy: {
    //                 created_at: 'desc', 
    //             },
    //             skip: skip,     
    //             take: limit,   

    //         });

    //         console.log("circleGet",circleGet)
    //         console.log("circleGets",circleGets)

    //         let resultData = [];

    //         for (const item of circleGets) {
    //             const matchedAsset = circleGet.find(asset => asset.location === item.location);

    //             if (matchedAsset) {
    //                 resultData.push(matchedAsset); 
    //             } else {

    //                 resultData.push(item);  
    //             }
    //         }

    //         return generateRes({
    //             data: resultData, 
    //             page,             
    //             limit,            
    //             totalPages: resultData.length, 
    //         });

    //     } catch (err) {
    //         console.error("Error fetching market circle data:", err);
    //         return generateRes({
    //             data: [],  // Return empty data on error
    //             message: 'Error fetching market circle data',
    //         });
    //     }
    // };

    marketcircle = async (req: Request) => {
        const page = Number(req.query.page) || 2;
        const limit = Number(req.query.limit) || 5;
        const id = Number(req.query.id) || 1;
        const skip = (page - 1) * limit;
        try {

            const totalRecords = await prisma.location.count({
                where: {
                    ulb_id: id,
                },
            });
            // let resultData = [];
            const circleGet = await prisma.location.findMany({
                where: {
                    ulb_id: id,
                },
                orderBy: {
                    created_at: 'asc',
                },
                skip: skip,
                take: limit,
            });

            // const circleGets = await prisma.assets_list.findMany({
            //     where: {
            //         ulb_id: id,
            //     },
            //     select: {
            //         location: true,
            //         id: true,
            //         ulb_id: true,
            //         building_name: true,
            //         address: true
            //     },
            //     orderBy: {
            //         created_at: 'asc',
            //     },
            //     skip: skip,
            //     take: limit,
            // });

            // for (const asset of circleGet) {
            //     const matchedAsset = circleGets.find(item => item.location === asset.location);
            //     if (matchedAsset) {
            //         resultData.push({
            //             ...asset,
            //             building_name: matchedAsset.building_name || null,
            //             address: matchedAsset.address || null
            //         });
            //     } else {
            //         resultData.push(asset);
            //     }
            // }

            return generateRes({
                data: circleGet,
                page,
                limit,
                totalPages: Math.ceil(totalRecords / limit),
            });

        } catch (err) {
            console.error("Error fetching market circle data:", err);
            return generateRes({
                data: [],
                message: 'Error fetching market circle data',
            });
        }
    };




    locationAdd = async (req: Request) => {
        const locationData = req.body.location || '';
        const addressData = req.body.address || '';
        const ids = req.body.id;
        try {
            const result = await prisma.$transaction(async (tx) => {
                const existingLocation = await tx.location.findFirst({
                    where: { location: locationData,
                        address: addressData,
                     },
                });


                if (existingLocation) {
                    throw new Error(`${locationData} already exists`);
                }

                const assetReq = await tx.location.create({
                    data: {
                        ulb_id: ids,
                        location: locationData || '',
                        is_active: true,
                        building_name: "",
                        address: addressData,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });

                return assetReq;
            });

            return generateRes(result);

        } catch (error) {
            console.error('Error processing request:', error);
            throw { error: 400, msg: "Unable to add location due to a duplicate" };
        }
    };

    locationEdit = async (req: Request) => {
        const { location, address, id } = req.body;
    
        try {
            const result = await prisma.$transaction(async (tx) => {
                const existingLocation = await tx.location.findUnique({
                    where: { id },
                });
    
                if (!existingLocation) {
                    throw new Error("Location not found");
                }
    
                const updatedLocation = await tx.location.update({
                    where: { id },
                    data: {
                        location: location || existingLocation.location,
                        address: address || existingLocation.address,
                        updated_at: new Date(),
                    },
                });
    
                return updatedLocation;
            });
    
            return generateRes(result);
        } catch (error) {
            console.error('Error updating location:', error);
            throw { error: 400, msg: "Unable to update location" };
        }
    };

    locationDelete = async (req: Request) => {
        const id = Number(req.query.id);
      
        try {
          const result = await prisma.$transaction(async (tx) => {
            const existingLocation = await tx.location.findUnique({
              where: { id },
            });
      
            if (!existingLocation) {
              return {
                status: 400,
                message: "Location not found",
                "meta-data": {
                  apiId: req.body.apiId,  // You can pass the apiId from the request body
                  action: "DELETE",
                  version: "1.0",
                },
              };
            }
      
            // Attempt to delete the location
            try {
              await tx.location.delete({
                where: { id },
              });
              return {
                status: 200,
                message: "Location deleted successfully",
                "meta-data": {
                  apiId: req.body.apiId,
                  action: "DELETE",
                  version: "1.0",
                },
              };
            } catch (error:any) {
              if (error.code === 'P2003') {
                return {
                  status: 400,
                  message: "You cannot delete this location because it is referenced by other records.",
                  "meta-data": {
                    apiId: req.body.apiId,
                    action: "DELETE",
                    version: "1.0",
                  },
                };
              }
              // Handle other errors if necessary
              return {
                status: 400,
                message: "Unable to delete location",
                "meta-data": {
                  apiId: req.body.apiId,
                  action: "DELETE",
                  version: "1.0",
                },
              };
            }
          });
      
          return result; // Return the response generated in the transaction
        } catch (error) {
          console.error('Error deleting location:', error);
          return {
            status: 400,
            message: "Unable to delete location",
            "meta-data": {
              apiId: req.body.apiId,
              action: "DELETE",
              version: "1.0",
            },
          };
        }
      };
      
      
    

      getFilteredAssets = async (location_id: number, building_name: string, id?: string) => {
        try {
            const assets = await prisma.assets_list.findMany({
                where: {
                    status: 2, // Approved assets only
                    type_of_assets: "Building",
                    location_id, // Filter by location_id
                    building_name: {
                        contains: building_name,
                        mode: "insensitive",
                    },
                    ...(id && { id }), // Filter by id if provided
                    floorData: {
                        some: {
                            details: {
                                some: {
                                    type: "Commercial",
                                },
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    location_id: true,
                    ulb_id: true,
                    building_name: true,
                    location: true,
                    address: true,
                    floorData: {
                        select: {
                            details: {
                                where: {
                                    type: "Commercial",
                                },
                                select: {
                                    id: true,
                                    index: true,
                                    type: true,
                                    length: true,
                                    breadth: true,
                                    height: true,
                                    name: true,
                                    property_name: true,
                                    type_of_plot: true,
                                },
                            },
                        },
                    },
                },
            });

            // Flatten the assets and map the data to the desired structure
            const shops = assets.flatMap(asset => 
                asset.floorData.flatMap(floor => 
                    floor.details.map(detail => ({
                        ...detail,
                        building_id: asset.id,
                        location_id: asset.location_id,
                        ulb_id: asset.ulb_id,
                        building_name: asset.building_name,
                        location: asset.location,
                        address: asset.address,
                    }))
                )
            );

            // Return the transformed data
            return { shops };
        } catch (error) {
            throw new Error("Error fetching filtered assets");
        }
    };

    

    async getShopById(shopId: number) {
        try {
            const shop = await prisma.details.findUnique({
                where: {
                    id: shopId,
                },
                select: {
                    id: true,
                    index: true,
                    type: true,
                    length: true,
                    breadth: true,
                    height: true,
                    name: true,
                    property_name: true,
                    type_of_plot: true,
                    floorData: {
                        select: {
                            assetsList: {
                                select: {
                                    id: true,
                                    location_id: true,
                                    building_name: true,
                                    area:true,
                                    from_whom_acquired:true,
                                    no_of_floors:true,
                                    location: true,
                                    plot_no:true,
                                    khata_no:true,
                                    ward_no:true,
                                    address: true,
                                }
                            }
                        }
                    }
                },
            });

            if (!shop) {
                throw new Error("Shop not found");
            }

            // Flatten the structure to match the required response
            return {
                ...shop,
                building_id: shop.floorData.assetsList.id,
                location_id: shop.floorData.assetsList.location_id,
                building_name: shop.floorData.assetsList.building_name,
                building_area: shop.floorData.assetsList.area,
                from_whom_acquired: shop.floorData.assetsList.from_whom_acquired,
                no_of_floors: shop.floorData.assetsList.no_of_floors,
                location: shop.floorData.assetsList.location,
                plot_no: shop.floorData.assetsList.plot_no,
                khata_no: shop.floorData.assetsList.khata_no,
                ward_no: shop.floorData.assetsList.ward_no,
                address: shop.floorData.assetsList.address,
                floorData: undefined // Remove the nested floorData object
            };
        } catch (error) {
            throw new Error("Error fetching shop details");
        }
    }
    

}




export default AssetsManagementDao;