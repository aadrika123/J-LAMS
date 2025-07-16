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
    //         role,
    //         floorData,
    //         no_of_floors,
    //         building_name,
    //         ulb_id,
    //         location,
    //         is_drafted
    //     } = req.body;
    
    //     const notificationsDao = new NotificationsDao();
    
    //     try {
    //         const result = await prisma.$transaction(async (tx) => {
    //             const assetCount = await tx.assets_list.count();
    //             const newIncrementId = assetCount + 1;
    //             const formattedIds = newIncrementId.toString().padStart(3, '0');
    
    //             const validUlbId = ulb_id ? String(ulb_id).trim() : '';
    //             const validAssetType = type_of_assets ? type_of_assets.toLowerCase().trim().replace(/\s+/g, '') : '';
    
    //             const formattedId = validUlbId && validAssetType
    //                 ? `${validUlbId}${validAssetType}${formattedIds}`
    //                 : 'invalid-id';
    
    //             const existingAsset = await tx.assets_list.findUnique({
    //                 where: { id: formattedId },
    //             });
    
    //             if (existingAsset) {
    //                 throw new Error(`Asset with ID ${formattedId} already exists`);
    //             }
    
    //             const assetReq = await tx.assets_list.create({
    //                 data: {
    //                     id: formattedId,
    //                     type_of_assets,
    //                     asset_sub_category_name,
    //                     assets_category_type,
    //                     khata_no,
    //                     plot_no,
    //                     ward_no,
    //                     address,
    //                     building_name,
    //                     ulb_id,
    //                     depreciation_method,
    //                     location,
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
    //                     no_of_floors,
    //                     status: 0,
    //                     is_drafted,
    //                     floorData: {
    //                         create: floorData.map((floor: any) => ({
    //                             floor: floor.floor,
    //                             plotCount: floor.plotCount,
    //                             type: floor.type,
    //                             details: {
    //                                 create: floor.details.map((detail: any) => ({
    //                                     index: detail.index,
    //                                     type: detail.type,
    //                                     length: detail.length ? String(detail.length) : null,
    //                                     breadth: detail.breadth ? String(detail.breadth) : null,
    //                                     height: detail.height ? String(detail.height) : null,
    //                                     name: detail.name,
    //                                     property_name: detail.property_name,
    //                                     type_of_plot: detail.type_of_plot,
    //                                 })),
    //                             },
    //                         })),
    //                     },
    //                 },
    //             });
    
    //             await tx.asset_fieldOfficer_req.create({
    //                 data: {
    //                     assetId: assetReq.id,
    //                 },
    //             });
    
    //             await tx.asset_checker_req.create({
    //                 data: {
    //                     assetId: assetReq.id,
    //                 },
    //             });
    
    //             const existingLocation = await tx.location.findFirst({
    //                 where: { location },
    //             });
    
    //             if (existingLocation) {
    //                 if (!existingLocation.building_name || !existingLocation.address) {
    //                     await tx.location.update({
    //                         where: { id: existingLocation.id },
    //                         data: {
    //                             building_name: existingLocation.building_name || building_name || '',
    //                             address: existingLocation.address || address || '',
    //                             updated_at: new Date(),
    //                         },
    //                     });
    //                 }
    //             } else {
    //                 await tx.location.create({
    //                     data: {
    //                         location: location || '',
    //                         ulb_id,
    //                         building_name: building_name || '',
    //                         address: address || '',
    //                         is_active: true,
    //                         created_at: new Date(),
    //                         updated_at: new Date(),
    //                     },
    //                 });
    //             }
    
    //             await notificationsDao.createNotification(assetReq.id, 0, role);
    
    //             return assetReq;
    //         });
    
    //         return generateRes(result);
    
    //     } catch (error:any) {
    //         console.error('Error processing request:', error);
    //         throw { error: 400, msg: error.message || 'An unexpected error occurred' };
    //     }
    // };

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
            location,
            is_drafted
        } = req.body;
    
        const notificationsDao = new NotificationsDao();
    
        try {
            const result = await prisma.$transaction(async (tx) => {
                // Step 1: Check if location exists
                let existingLocation = await tx.location.findFirst({
                    where: { location },
                });
    
                // Step 2: If location does not exist, create it
                if (!existingLocation) {
                    existingLocation = await tx.location.create({
                        data: {
                            location: location || '',
                            ulb_id,
                            building_name: building_name || '',
                            address: address || '',
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                }
    
                // Step 3: Generate `assets_id`
                const assetCount = await tx.assets_list.count();
                const newIncrementId = assetCount + 1;
                const formattedIds = newIncrementId.toString().padStart(3, '0');
    
                const validUlbId = ulb_id ? String(ulb_id).trim() : '';
                const validAssetType = type_of_assets ? type_of_assets.toLowerCase().trim().replace(/\s+/g, '') : '';
    
                const generatedAssetsId = validUlbId && validAssetType
                    ? `${validUlbId}${validAssetType}${formattedIds}`
                    : 'invalid-id';
    
                const existingAsset = await tx.assets_list.findUnique({
                    where: { assets_id: generatedAssetsId },
                });
    
                if (existingAsset) {
                    throw new Error(`Asset with ID ${generatedAssetsId} already exists`);
                }
    
                // Step 4: Create asset entry with the correct location_id
                const assetReq = await tx.assets_list.create({
                    data: {
                        assets_id: generatedAssetsId, // Storing custom ID in assets_id
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
                        is_drafted,
                        location_id: existingLocation.id, // Use the correct location ID
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
    
                await notificationsDao.createNotification(assetReq.assets_id, 0, role);
    
                return assetReq;
            });
    
            return generateRes(result);
        } catch (error: any) {
            console.error('Error processing request:', error);
            throw { error: 400, msg: error.message || 'An unexpected error occurred' };
        }
    };
    
    
    

    postWithModifiedId = async (req: Request) => {
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
                // Step 1: Check if location exists
                let existingLocation = await tx.location.findFirst({
                    where: { location },
                });
    
                // Step 2: If location does not exist, create it
                if (!existingLocation) {
                    existingLocation = await tx.location.create({
                        data: {
                            location: location || '',
                            ulb_id,
                            building_name: building_name || '',
                            address: address || '',
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                }
    
                // Step 3: Find all existing assets with the same `assets_id` prefix to determine versioning
                const existingAssets = await tx.assets_list.findMany({
                    where: {
                        assets_id: {
                            startsWith: assetId, // Filter based on assets_id, not id
                        },
                    },
                    select: { assets_id: true },
                });
    
                // Determine the highest version number
                const maxVersion = existingAssets
                    .map((asset) => {
                        const parts = asset.assets_id.split('-');
                        return parts.length > 1 ? parseInt(parts[1], 10) : 0;
                    })
                    .reduce((max, current) => Math.max(max, current), 0);
    
                const newAssetsId = `${assetId}-${maxVersion + 1}`;
    
                // Ensure the new `assets_id` doesn't already exist
                const existingAsset = await tx.assets_list.findUnique({
                    where: { assets_id: newAssetsId }, // Using assets_id instead of id
                });
    
                if (existingAsset) {
                    throw new Error(`Asset with ID ${newAssetsId} already exists`);
                }
    
                // Step 4: Create the new asset entry first (without floorData)
                const assetReq = await tx.assets_list.create({
                    data: {
                        assets_id: newAssetsId, // Store custom-generated ID here
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
                        is_restructured: true, // Mark as restructured
                        location_id: existingLocation.id, // ✅ Use the correct `location_id`
                    },
                });
    
                // Step 5: Now create floorData separately using the correct `assetReq.id`
                if (floorData && floorData.length > 0) {
                    await tx.floorData.createMany({
                        data: floorData.map((floor: any) => ({
                            floor: floor.floor,
                            plotCount: floor.plotCount,
                            type: floor.type,
                            assetsListId: assetReq.id, // ✅ Now `assetReq.id` exists
                        })),
                    });
    
                    // Insert details separately
                    for (const floor of floorData) {
                        const createdFloor = await tx.floorData.findFirst({
                            where: {
                                assetsListId: assetReq.id,
                                floor: floor.floor,
                            },
                            select: { id: true },
                        });
    
                        if (createdFloor && floor.details && floor.details.length > 0) {
                            await tx.details.createMany({
                                data: floor.details.map((detail: any) => ({
                                    floorDataId: createdFloor.id, // ✅ Correct reference now
                                    index: detail.index,
                                    type: detail.type,
                                    length: detail.length ? String(detail.length) : null,
                                    breadth: detail.breadth ? String(detail.breadth) : null,
                                    height: detail.height ? String(detail.height) : null,
                                    name: detail.name,
                                    property_name: detail.property_name,
                                    type_of_plot: detail.type_of_plot,
                                })),
                            });
                        }
                    }
                }
    
                // Step 6: Create associated field officer request
                await tx.asset_fieldOfficer_req.create({
                    data: {
                        assetId: assetReq.id, // Use the new `id` (auto-incremented primary key)
                    },
                });
    
                // Step 7: Create associated checker request
                await tx.asset_checker_req.create({
                    data: {
                        assetId: assetReq.id,
                    },
                });
    
                // Step 8: Log the asset changes in the change log
                await tx.assets_list_change_log.create({
                    data: {
                        assetId: assetReq.id, // Store `assets_id` here
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
                        status: 0,
                        role,
                    },
                });
    
                // Step 9: Create a notification for the newly created asset
                await notificationsDao.createNotification(assetReq.assets_id, 0, role);
    
                return assetReq;
            });
    
            return generateRes(result);
        } catch (error: any) {
            console.error('Error processing request:', error);
            throw { error: 400, msg: "Duplicate entry or processing error" };
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


    // getAll = async (req: Request) => {
    //     const page = Number(req.query.page) || 1;
    //     const limit = Number(req.query.limit) || 10;
    //     const search = req.query.search as string || '';
    //     const filter = req.query.filter as string || '';
    //     const { ulb_id } = req.body.auth || { ulb_id: 2 };
    //     const status = Number(req.query.status);
    //     const land = req.query.land as string || '';
    //     const ward_no = req.query.ward_no as string || ''; // Extract ward_no from query
    //     const skip = (page - 1) * limit;
    
    //     // Status counts
    //     const status1Items = await prisma.assets_list.count({ where: { status: 2 } });
    //     const statusMinus1Items = await prisma.assets_list.count({ where: { status: -2 } });
    //     const statusPendingAssets = await prisma.assets_list.count({ where: { status: 1 } });
    
    //     try {
    //         // Count with filters
    //         const count = await prisma.assets_list.count({
    //             where: {
    //                 OR: search ? [
    //                     { type_of_assets: { contains: search, mode: "insensitive" } },
    //                     { asset_sub_category_name: { contains: search, mode: "insensitive" } },
    //                     { khata_no: { contains: search, mode: "insensitive" } },
    //                     { ward_no: { contains: search, mode: "insensitive" } },
    //                     { assets_category_type: { contains: search, mode: "insensitive" } },
    //                     { area: { contains: search, mode: "insensitive" } },
    //                     { assets_id: { contains: search, mode: "insensitive" } }
    //                 ] : undefined,
    //                 ulb_id: ulb_id,
    //                 AND: [
    //                     filter ? {
    //                         OR: [
    //                             { assets_category_type: { equals: filter, mode: "insensitive" } },
    //                             { type_of_assets: { equals: filter, mode: "insensitive" } }
    //                         ]
    //                     } : {},
    //                     (status === 0 || status) ? { status: { equals: status } } : {},
    //                     land ? { type_of_land: { equals: land, mode: "insensitive" } } : {},
    //                     ward_no ? { ward_no: { equals: ward_no, mode: "insensitive" } } : {} // Filter by ward_no
    //                 ]
    //             }
    //         });
    
    //         const totalPages = Math.ceil(count / limit);
    
    //         // Get assets with filters
    //         const assetGet = await prisma.assets_list.findMany({
    //             skip: skip,
    //             take: limit,
    //             where: {
    //                 OR: search ? [
    //                     { type_of_assets: { contains: search, mode: "insensitive" } },
    //                     { asset_sub_category_name: { contains: search, mode: "insensitive" } },
    //                     { khata_no: { contains: search, mode: "insensitive" } },
    //                     { ward_no: { contains: search, mode: "insensitive" } },
    //                     { assets_category_type: { contains: search, mode: "insensitive" } },
    //                     { area: { contains: search, mode: "insensitive" } },
    //                     { assets_id: { contains: search, mode: "insensitive" } }
    //                 ] : undefined,
    //                 ulb_id: ulb_id,
    //                 AND: [
    //                     filter ? {
    //                         OR: [
    //                             { assets_category_type: { equals: filter, mode: "insensitive" } },
    //                             { type_of_assets: { equals: filter, mode: "insensitive" } }
    //                         ]
    //                     } : {},
    //                     (status === 0 || status) ? { status: { equals: status } } : {},
    //                     land ? { type_of_land: { equals: land, mode: "insensitive" } } : {},
    //                     ward_no ? { ward_no: { equals: ward_no, mode: "insensitive" } } : {} // Filter by ward_no
    //                 ]
    //             },
    //             include: {
    //                 floorData: {
    //                     include: {
    //                         details: true,
    //                     },
    //                 },
    //             },
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
        const { ulb_id } = req.body.auth || { ulb_id: 2 };
        const status = Number(req.query.status);
        const land = req.query.land as string || '';
        const ward_no = req.query.ward_no as string || '';
        const skip = (page - 1) * limit;
        const isFieldOfficer = req.query.is_fieldofficer === 'true'; // Ensure boolean conversion
    
        // Status counts
        const status1Items = await prisma.assets_list.count({ where: { status: 2 } });
        const statusMinus1Items = await prisma.assets_list.count({ where: { status: -2 } });
        const statusPendingAssets = await prisma.assets_list.count({ where: { status: 1 } });
    
        try {
            // Count with filters
            const count = await prisma.assets_list.count({
                where: {
                    OR: search ? [
                        { type_of_assets: { contains: search, mode: "insensitive" } },
                        { asset_sub_category_name: { contains: search, mode: "insensitive" } },
                        { khata_no: { contains: search, mode: "insensitive" } },
                        { ward_no: { contains: search, mode: "insensitive" } },
                        { assets_category_type: { contains: search, mode: "insensitive" } },
                        { area: { contains: search, mode: "insensitive" } },
                        { assets_id: { contains: search, mode: "insensitive" } }
                    ] : undefined,
                    ulb_id: ulb_id,
                    AND: [
                        filter ? {
                            OR: [
                                { assets_category_type: { equals: filter, mode: "insensitive" } },
                                { type_of_assets: { equals: filter, mode: "insensitive" } }
                            ]
                        } : {},
                        (status === 0 || status) ? { status: { equals: status } } : {},
                        land ? { type_of_land: { equals: land, mode: "insensitive" } } : {},
                        ward_no ? { ward_no: { equals: ward_no, mode: "insensitive" } } : {},
                        isFieldOfficer ? { is_drafted: false } : {} // Only include is_drafted: false if isFieldOfficer is true
                    ]
                }
            });
    
            const totalPages = Math.ceil(count / limit);
    
            // Get assets with filters
            const assetGet = await prisma.assets_list.findMany({
                skip: skip,
                take: limit,
                where: {
                    OR: search ? [
                        { type_of_assets: { contains: search, mode: "insensitive" } },
                        { asset_sub_category_name: { contains: search, mode: "insensitive" } },
                        { khata_no: { contains: search, mode: "insensitive" } },
                        { ward_no: { contains: search, mode: "insensitive" } },
                        { assets_category_type: { contains: search, mode: "insensitive" } },
                        { area: { contains: search, mode: "insensitive" } },
                        { assets_id: { contains: search, mode: "insensitive" } }
                    ] : undefined,
                    ulb_id: ulb_id,
                    AND: [
                        filter ? {
                            OR: [
                                { assets_category_type: { equals: filter, mode: "insensitive" } },
                                { type_of_assets: { equals: filter, mode: "insensitive" } }
                            ]
                        } : {},
                        (status === 0 || status) ? { status: { equals: status } } : {},
                        land ? { type_of_land: { equals: land, mode: "insensitive" } } : {},
                        ward_no ? { ward_no: { equals: ward_no, mode: "insensitive" } } : {},
                        isFieldOfficer ? { is_drafted: false } : {} // Only include is_drafted: false if isFieldOfficer is true
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
        const id = Number(req.query.id);
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
                    asset_fieldOfficer: true, 
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

    // sahil
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
    //         // floorData
    //         floorData
    //     } = req.body;

    //     const id = String(req.query.id);
    //     const notificationsDao = new NotificationsDao();

    //     try {
    //         const result = await prisma.$transaction(async (tx) => {
    //             const existingAsset: any = await tx.assets_list.findUnique({
    //                 where: {
    //                     id
    //                 },
    //                 include: {
    //                     floorData: {
    //                         include: {
    //                             details: true
    //                         }
    //                     }
    //                 }
    //             });

    //             console.log("existingAsset", existingAsset)

    //             if (!existingAsset) {
    //                 console.log("Asset not found");
    //                 throw new Error("Asset not found");
    //             }

    //             // Log change in status to notifications
    //             if (existingAsset.status !== status) {
    //                 await notificationsDao.createNotification(id, status, existingAsset.role);
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
    //                     is_drafted:false
    //                 }
    //             });

    //             const existingFloorData = existingAsset.floorData;
    //             const existingFloorIds = existingFloorData?.map((floor: any) => floor.id);
    //             const incomingFloorIds = floorData?.map((floor: any) => floor.id);

    //             await tx.floorData.deleteMany({
    //                 where: {
    //                     id: {
    //                         in: existingFloorIds.filter((id: any) => !incomingFloorIds?.includes(id))
    //                     }
    //                 }
    //             });

    //             for (const floor of floorData) {
    //                 if (existingFloorIds?.includes(floor.id)) {
    //                     await tx.floorData?.update({
    //                         where: {
    //                             id: floor?.id
    //                         },
    //                         data: {
    //                             floor: floor?.floor,
    //                             plotCount: floor?.plotCount,
    //                             type: floor?.type,
    //                             details: {
    //                                 deleteMany: {
    //                                     floorDataId: floor?.id
    //                                 },
    //                                 create: floor.details.map((detail: any) => ({
    //                                     index: detail?.index,
    //                                     type: detail?.type,
    //                                     length: detail?.length,
    //                                     breadth: detail?.breadth,
    //                                     height: detail?.height,
    //                                     name: detail?.name,
    //                                     property_name: detail?.property_name,
    //                                     type_of_plot: detail?.type_of_plot
    //                                 }))
    //                             }
    //                         }
    //                     });
    //                 } else {
    //                     await tx.floorData.create({
    //                         data: {
    //                             floor: floor.floor,
    //                             plotCount: floor.plotCount,
    //                             type: floor.type,
    //                             assetsListId: id,
    //                             details: {
    //                                 create: floor.details.map((detail: any) => ({
    //                                     index: detail.index,
    //                                     type: detail.type,
    //                                     length: detail.length,
    //                                     breadth: detail.breadth,
    //                                     height: detail.height,
    //                                     name: detail.name,
    //                                     property_name: detail.property_name,
    //                                     type_of_plot: detail.type_of_plot
    //                                 }))
    //                             }
    //                         }
    //                     });
    //                 }
    //             }

    //             if (status === 1) {
    //                 await tx.asset_fieldOfficer_req.update({
    //                     where: {
    //                         assetId: id
    //                     },
    //                     data: {
    //                         long: req.body.long,
    //                         lat: req.body.lat,
    //                         remarks: req.body.remarks,
    //                         image_one: req.body.image_one,
    //                         image_two: req.body.image_two,
    //                         image_three: req.body.image_three,
    //                         image_four: req.body.image_four,
    //                         image_five: req.body.image_five
    //                     }
    //                 });
    //             }

    //             const existence: number = await prisma.asset_checker_req.count({
    //                 where: {
    //                     assetId: id
    //                 }
    //             });

    //             if (existence === 0 || status === 2 || status === -2) {
    //                 await tx.asset_checker_req.update({
    //                     where: {
    //                         assetId: updatedAsset?.id
    //                     },
    //                     data: {
    //                         checker_remarks: req.body.checker_remarks
    //                     }
    //                 });
    //             }

    //             return updatedAsset;
    //         });

    //         console.log("result", result);
    //         return generateRes(result);
    //     } catch (error: any) {
    //         console.error("err", error);
    //         return error;
    //     }
    // };

    // sahil




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
            role,
            floordata,
            no_of_floors,
            building_name,
            ulb_id,
            location,
            is_drafted,
            status
        } = req.body;
        
        
        console.log("req.body", plot_no);
    
        // Convert id to an integer
        const id = parseInt(req.query.id as string, 10);
        if (isNaN(id)) {
            throw new Error("Invalid ID: ID must be a number.");
        }
        const assets_id = String(req.query.assets_id); // Ensure assets_id is used
        const isMobile = Boolean(req.query.isMobile) || false;
        const notificationsDao = new NotificationsDao();
    
        try {
            const result = await prisma.$transaction(async (tx: any) => {
                const existingAsset: any = await tx.assets_list.findUnique({
                    where: {
                        id: id, // ✅ Now it's an integer
                    },
                    include: {
                        floorData: {
                            include: {
                                details: true
                            }
                        }
                    }
                });
    
                if (!existingAsset) {
                    throw new Error("Asset not found");
                }
    
                // Log change in status to notifications (create only one notification using assets_id)
                if (existingAsset.status !== req.body.status) {
                    await notificationsDao.createNotification(assets_id, req.body.status, existingAsset.role); // Use assets_id here
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
                        id: id, 
                        assets_id: assets_id // Ensure assets_id is correctly used here
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
                        status: Number(req.body.status),
                        is_drafted
                    }
                });
    
                const existingFloorData = existingAsset.floorData;
                const existingFloorIds = existingFloorData?.map((floor: any) => floor.id);
                const incomingFloorIds = floordata?.map((floor: any) => floor.id);
    
                // if (!isMobile) {
                //     await tx.floorData.deleteMany({
                //         where: {
                //             id: {
                //                 in: existingFloorIds.filter((id: any) => !incomingFloorIds?.includes(id))
                //             }
                //         }
                //     });
                // }
    
                if (type_of_assets === 'Building' && Array.isArray(floordata)) {
                    for (const floor of floordata) {
                        if (existingFloorIds?.includes(floor.id)) {
                            await tx.floorData.update({
                                where: { id: floor.id },
                                data: {
                                    floor: floor.floor,
                                    plotCount: floor.plotCount,
                                    type: floor.type,
                                    details: {
                                        deleteMany: { floorDataId: floor.id },
                                        create: Array.isArray(floor.details) ? floor.details.map((detail: any) => ({
                                            index: detail.index,
                                            type: detail.type,
                                            length: detail.length,
                                            breadth: detail.breadth,
                                            height: detail.height,
                                            name: detail.name,
                                            property_name: detail.property_name,
                                            type_of_plot: detail.type_of_plot
                                        })) : []
                                    }
                                }
                            });
                        } else {
                            await tx.floorData.create({
                                data: {
                                    floor: String(floor.floor),
                                    plotCount: floor.plotCount,
                                    type: floor.type,
                                    assetsListId: id,
                                    details: {
                                        create: Array.isArray(floor.details) ? floor.details.map((detail: any) => ({
                                            index: detail.index,
                                            type: detail.type,
                                            length: detail.length,
                                            breadth: detail.breadth,
                                            height: detail.height,
                                            name: detail.name,
                                            property_name: detail.property_name,
                                            type_of_plot: detail.type_of_plot
                                        })) : []
                                    }
                                }
                            });
                        }
                    }
                }
    
                if (req.body.status === 1 || req.body.status === 3) {
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
                        assetId: updatedAsset?.id
                    }
                });
    
                if (existence === 0 || req.body.status === 2 || req.body.status === -2) {
                    await tx.asset_checker_req.update({
                        where: {
                            assetId: updatedAsset?.id
                        },
                        data: {
                            checker_remarks: req.body.checker_remarks
                        }
                    });
                }
    
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
                            ulb_id,
                            building_name: building_name || '',
                            address: address || '',
                            is_active: true,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                }
    
                await notificationsDao.createNotification(updatedAsset.assets_id, req.body.status, req.body.role); // Use assets_id
    
                return updatedAsset;
            });
    
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
        const id = Number(req.query.id)


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
        const id = Number(req.query.id)

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
      
      
    

      getFilteredAssets = async (location_id: number, building_name: string, id?: number) => {
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