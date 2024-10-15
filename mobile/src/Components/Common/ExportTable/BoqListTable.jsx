import BoqDetailModal from "@/Components/Pages/PMS/BOQ/BoqDetailModal";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BoqListTable = (props) => {
  const [detailModal, setDetailModal] = useState(false);
  const [singleProNo, setSingleProNo] = useState();

  const navigate = useNavigate();

  // const COLUMNS = [
  //   { header: "", },
  //   { header: "S No", },
  //   { header: "Procurement No", },
  //   { header: "Category" ,},
  //   { header: "Sub Category" ,},
  //   { header: "Brand" ,},
  //   { header: "Description" ,},
  //   { header: "Action", },
  // ];

  let COLUMNS =
    props?.page == "outbox"
      ? [
          { header: "#" },
          { header: "S No" },
          { header: "Reference No" },
          { header: "Category" },
          { header: "Estimated Cost" },
          { header: "Status" },
          { header: "Action" },
        ]
      : props?.page == "outbox"
      ? [
          { header: "#" },
          { header: "S No" },
          { header: "Procurement No" },
          { header: "Category" },
          { header: "Sub Category" },
          { header: "Brand" },
          { header: "Description" },
          { header: "Action" },
        ]
      : props?.columns;

  // console.log(count,"counting");

  // get the Procurement Id
  const handleChange = (id) => {
    if (!props?.proNos.includes(id)) {
      props?.setProNos((prev) => [...prev, id]);
      props?.setCount((prev) => prev + 1);
    } else {
      let data = props?.proNos.filter((item) => item != id);
      props?.setProNos(data);
      props?.setCount((prev) => prev - 1);
    }
  };

  // console.log(props?.page,"pageeeeeeeeeeeeeeeeeee");

  const openDetailModal = (data, refNo) => {
    setSingleProNo(data);

    props?.page == "outbox"
      ? navigate(`/boq-details-byId/${refNo}`)
      : setDetailModal(true);
  };

  if (detailModal) {
    return (
      <>
        <BoqDetailModal
          setDetailModal={setDetailModal}
          singleProNo={singleProNo}
        />
      </>
    );
  }

  return (
    <>
      <div className='m-4 overflow-x-auto max-h-96'>
        <h1>
          Total Result : <span className='font-bold'>{props?.pagination}</span>
        </h1>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
          <thead className='text-xs text-start text-[#1f2937] uppercase bg-[#e2e8f0] sticky -top-0'>
            <tr className='pl-3'>
              {COLUMNS?.length &&
                COLUMNS?.map((item, index) => (
                  <th scope='col' className='p-4' key={index}>
                    <div className='flex items-center'>{item?.header}</div>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {props?.dataList?.length ? (
              props?.dataList.map((items, index) => (
                <tr
                  className='text-start text-black border-b hover:bg-[#fafafb]'
                  key={index}
                >
                  <td className='w-4 p-4'>
                    <div className='flex items-center'>
                      <input
                        id='checkbox-table-search-1'
                        type='checkbox'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                        onChange={() => {
                          handleChange(items?.stock_handover_no);
                        }}
                      />
                    </div>
                  </td>

                  {/* <td className='px-6 py-2'>{index + 1}</td> */}
                  {props?.page == "outbox" ? (
                    <td className='px-6 py-2'>{items?.reference_no}</td>
                  ) : (
                    <td className='px-6 py-2'>{items?.stock_handover_no}</td>
                  )}
                  {props?.page == "outbox" ? (
                    <td className='px-6 py-2'>
                      {items?.procurements[0]?.category?.name}
                    </td>
                  ) : (
                    <td className='px-4 py-2'>
                      {items?.inventory?.category?.name}
                    </td>
                  )}
                  {props?.page == "outbox" ? (
                    <td className='px-6 py-2'>{items?.estimated_cost}</td>
                  ) : (
                    <td className='px-4 py-2'>
                      {items?.inventory?.subcategory?.name}
                    </td>
                  )}
                  {props?.page == "outbox" ? (
                    <td className='px-6 py-2'>{items?.status}</td>
                  ) : (
                    <td className='px-4 py-2'>{items?.emp_name}</td>
                  )}
                  {props?.page != "outbox" && (
                    <td className='px-4 py-2'>{items?.allotted_quantity}</td>
                  )}
                  {/* <td className="px-6 py-4">{items.subcategory.name}</td>
                  <td className="px-6 py-4">{items.brand.name}</td>
                  <td className="px-6 py-4">{items.description}</td> */}

                  <td className=''>
                    <button
                      className='bg-[#4338ca] text-white pl-3 pr-3 pt-1 pb-1 ml-3 rounded hover:bg-[#5d51de]'
                      onClick={() =>
                        openDetailModal(
                          items?.procurement_no,
                          items?.reference_no
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <p></p>
            )}
          </tbody>
        </table>

        {/* 
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500  mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Showing <span className="font-semibold text-gray-900 ">1-10</span>{" "}
            of <span className="font-semibold text-gray-900 ">1000</span>
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 "
              >
                Previous
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
              >
                2
              </a>
            </li>
            <li>
              <a
                href="#"
                aria-current="page"
                className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
              >
                4
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
              >
                5
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
              >
                Next
              </a>
            </li>
          </ul>
        </nav> */}
      </div>
    </>
  );
};

export default BoqListTable;
