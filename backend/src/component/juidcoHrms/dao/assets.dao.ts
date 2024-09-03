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
            floorData,
            no_of_floors
        } = req.body;

        try {
            const result = await prisma.$transaction(async (tx) => {
                const assetReq = await tx.assets_list.create({
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
                                        length: detail.length,
                                        breadth: detail.breadth,
                                        height: detail.height,
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

                return assetReq;
            });

            return generateRes(result);

        } catch (error) {
            console.error('Error processing request:', error);
            throw { error: 400, msg: "duplicate" }
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
        const count = await prisma.assets_list.count();
        const totalPages = Math.ceil(count / limit);
        const filter = req.query.filter as string || '';

        const status = Number(req.query.status)

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
                    AND: [
                        filter ? {
                            assets_category_type: {
                                equals: filter,
                                mode: "insensitive",
                            },
                        } : {},
                        (status === 0 || status) ? {
                            status: {
                                equals: status,
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
        const id = Number(req.query.id)
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
            status,
            // floorData
            floorData = []
        } = req.body;

        const id = Number(req.query.id);

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
}

export default AssetsManagementDao;