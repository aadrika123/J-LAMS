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
            floorData = [],  // Default to empty array if not provided
            no_of_floors,
            building_name,
            ulb_id,
            location
        } = req.body;
        console.log("req.body",req.body)

        console.log("req.body floorData",floorData)
    
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
    console.log("lastAsset",lastAsset)
                const lastId = lastAsset ? String(lastAsset.id).match(/(\d{3})$/) : null;
                console.log("lastId",lastId)
                const lastNumericId = lastId ? Number(lastId[0]) : 0;
                console.log("lastNumericId",lastNumericId)
                const newIncrementId = lastNumericId + 1;
                const formattedIds = newIncrementId.toString().padStart(3, '0');
                console.log("formattedIds",formattedIds)
                const validUlbId = ulb_id ? String(ulb_id).trim() : '';
                const validAssetType = type_of_assets ? type_of_assets.toLowerCase().trim() : '';
                const formattedId = validUlbId && validAssetType
                    ? `${validUlbId}${validAssetType}${formattedIds}`
                    : 'invalid-id'; 
    
                console.log("Generated formattedId:", formattedId);
    
                const existingAsset = await tx.assets_list.findUnique({
                    where: { id: formattedId },
                });
                console.log("Generated formattedId: existingAsset", existingAsset);
                if (!existingAsset == null) {
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
                        address: address || null,  // Handle potential null or empty values
                        building_name: building_name,
                        ulb_id: ulb_id,
                        depreciation_method: depreciation_method || null, // Ensure undefined values are handled
                        location: location,
                        apreciation_method: apreciation_method || null,
                        ownership_doc: ownership_doc || null,
                        blue_print: blue_print || null,
                        type_of_land: type_of_land,
                        area: area,
                        order_no: order_no || null,
                        order_date: order_date || null,
                        acquisition: acquisition || null,
                        from_whom_acquired: from_whom_acquired || null,
                        mode_of_acquisition: mode_of_acquisition || null,
                        role: role,
                        no_of_floors: no_of_floors,
                        status: 0,
                        floorData: {
                            create: Array.isArray(floorData) && floorData.length > 0
                                ? floorData.map((floor: any) => ({
                                      floor: floor.floor || null, // Handle missing floor value
                                      plotCount: floor.plotCount || 0, // Provide default value for plotCount
                                      type: floor.type || 'Unknown', // Default value for type if missing
                                      assetsListId: formattedId, // Use the formattedId for the foreign key
                                      details: {
                                          create: Array.isArray(floor.details) && floor.details.length > 0
                                              ? floor.details.map((detail: any) => ({
                                                    index: detail.index || null, // Handle missing index
                                                    type: detail.type || 'Unknown', // Default type
                                                    length: detail.length || null, // Handle missing length
                                                    breadth: detail.breadth || null, // Handle missing breadth
                                                    height: detail.height || null, // Handle missing height
                                                    name: detail.name || 'Unknown', // Default name if missing
                                                    property_name: detail.property_name || 'Unknown', // Handle missing property_name
                                                    type_of_plot: detail.type_of_plot || 'Unknown' // Default type_of_plot
                                              }))
                                              : []
                                      }
                                  }))
                                : []
                        }
                    }
                });
                
                
    
                console.log("assetReqassetReq",assetReq)
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
                 console.log("assetReqassetReq lin2 217")
    
                const existingLocation = await tx.location.findFirst({
                    where: { location: location },
                });
                console.log("assetReqassetReq lin2 222 existingLocation",existingLocation)
    
                if (existingLocation) {
                    console.log("255")
                    if (!existingLocation.building_name || !existingLocation.address) {
                        const updatedLocation = await tx.location.update({
                            where: { id: existingLocation.id },
                            data: {
                                building_name: existingLocation.building_name || req.body.building_name || "",
                                address: existingLocation.address || req.body.address || "",
                                updated_at: new Date(),
                            },
                        });
                        console.log("Location updated in location table:", updatedLocation);
                    }
                } else {
                    console.log("assetReqassetReq lin2 222 existingLocation")
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
                    console.log("New location saved in location table:", newLocation);
                }
    
                return assetReq;
            });
            console.log("result",result)
    
            return generateRes(result);
    
        } catch (error:any) {
            console.error('Error processing request:', error);
            console.error('Error processing request:', error.message);
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
        const {ulb_id} = req.body.auth ||2;
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
        const id =  Number(req.query.id) || 1;

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

        const id = Number(req.query.id) || 1;  
        try {
          // Fetch circle data
          const circleGet = await prisma.location.findMany({
            where: {
              ulb_id: id,
            },
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
        const page = Number(req.query.page) || 1; 
        const limit = Number(req.query.limit) || 5; 
        const id = Number(req.query.id) || 1;
        const skip = (page - 1) * limit;
        try {
            let resultData = [];
            const circleGet = await prisma.location.findMany({
                where: {
                    ulb_id: id,
                },
                orderBy: {
                    created_at: 'desc', 
                },
                skip: skip,      
                take: limit,   
            });
    
            const circleGets = await prisma.assets_list.findMany({
                where: {
                    ulb_id: id,
                },
                select: {
                    location: true,
                    id: true,
                    ulb_id: true,
                    building_name: true,
                    address: true
                },
                orderBy: {
                    created_at: 'desc', 
                },
                skip: skip,     
                take: limit,   
            });
    
            for (const asset of circleGet) {
                const matchedAsset = circleGets.find(item => item.location === asset.location);
                if (matchedAsset) {
                    resultData.push({
                        ...asset, 
                        building_name: matchedAsset.building_name || null,
                        address: matchedAsset.address || null              
                    });
                } else {
                    resultData.push(asset);
                }
            }
    
            return generateRes({
                data: resultData, 
                page,             
                limit,            
                totalPages: Math.ceil(resultData.length / limit), 
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
        const ids = req.body.id;
        try {
            const result = await prisma.$transaction(async (tx) => {
                const existingLocation  = await tx.location.findFirst({
                    where: { location:locationData, }, 
                });
    
    
                if (existingLocation ) {
                    throw new Error(`${locationData} already exists`);
                }

                const assetReq = await tx.location.create({
                    data: {
                        ulb_id: ids, 
                        location: locationData||'',
                        is_active: true, 
                        building_name:"",
                        address:"",   
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

    
}

export default AssetsManagementDao;