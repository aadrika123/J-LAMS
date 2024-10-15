import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePDF } from "react-to-pdf";

const ExportTableData = () => {
  const [columnsP, setColumnsP] = useState();
  const { state } = useLocation();

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const { columns, data } = state;
  const newColumns = JSON.parse(columns);

  const filterActionHeading = () => {
    const filtered = newColumns.filter((col) => col.Header != "Action");
    return filtered;
  };

  //   const columnsParse = JSON.parse(columns);

  useEffect(() => {
    const headersNew = filterActionHeading();
    setColumnsP(headersNew);
  }, [columns]);

  return (
    <>
      <button
        onClick={() => toPDF()}
        className={`w-96 border mt-4 bg-indigo-700 text-white border-blue-950 pl-5 pr-5 pt-1 pb-1 rounded hover:bg-indigo-500 `}
      >
        Print
      </button>
      <div ref={targetRef} className='p-4'>
        <table className='min-w-full bg-white border-collapse border border-gray-200'>
          <thead>
            {columnsP?.length > 0 &&
              columnsP?.map((heading, index) => (
                <th key={index} className='border border-gray-200 px-4 py-2'>
                  {heading?.Header}
                </th>
              ))}
          </thead>
          <tbody>
            {data?.length > 0 &&
              data.map((row, index) => (
                <tr key={row?.procurement_no}>
                  <td className='border border-gray-200 px-4 py-2'>
                    {index + 1}
                  </td>
                  <td className='border border-gray-200 px-4 py-2'>
                    {row?.procurement_no}
                  </td>
                  <td className='border border-gray-200 px-4 py-2'>
                    {row?.category?.name}
                  </td>
                  <td className='border border-gray-200 px-4 py-2'>
                    {row?.subcategory?.name}
                  </td>
                  <td className='border border-gray-200 px-4 py-2'>
                    {row?.brand?.name}
                  </td>

                  <td className='border border-gray-200 px-4 py-2'>
                    {row?.status?.status == -1
                      ? "Back to SR"
                      : row?.status?.status == -2
                      ? "Rejected"
                      : row?.status?.status == 0
                      ? "Pending"
                      : row?.status?.status == 1
                      ? "DA's Inbox"
                      : row?.status?.status == 2
                      ? "Release for Tender"
                      : row?.status?.status == 3
                      ? "Supplier Assigned"
                      : row?.status?.status == 4
                      ? "Incomplete stocks received"
                      : row?.status?.status == 5
                      ? "Stocks received"
                      : ""}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExportTableData;
