import { useContext, useEffect, useState } from 'react';
import { contextVar } from '@/Components/context/contextVar'; // Adjust path if necessary
import TitleBar from '../../Others/TitleBar'; // Adjust path if necessary
import InnerHeading from './InnerHeading';
import SubHeading from './SubHeading';
import HomeIcon from '../../../../assets/Images/home1.svg';
import ImageUploader from './ImageUploader';
import ConfirmationModal from '@/Components/Common/Modal/ConfirmationModal';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewByIdList = () => {
  // Get the title bar visibility from the context
  const { titleBarVisibility } = useContext(contextVar);
 
  // const [modalSideMessage, setModalSideMessage] = useState("");
  const [role, setRole] = useState('');

  const [viewData, setViewData] = useState(null);

  const { id } = useParams();
 const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: `https://aadrikainfomedia.com/auth/api/lams/v1/asset/get-single/?id=${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer 41899|p9Ua0dvtsdhYBLUU0IhiawM32yC6tYZT9JQQgQpa099f8725`
          }
        });
        setViewData(res?.data?.data.data);
        console.log('Fetched data:', res?.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, [id]); // Dependency array includes `id` to refetch if the `id` changes

  // Conditional rendering to avoid errors if `viewData` is null
  if (!viewData) {
    return <div>Loading...</div>;
  }

  console.log('dsfcfcs0', viewData);
  const userDetailsString = localStorage.getItem('userDetails');
  const userDetails = userDetailsString ? JSON.parse(userDetailsString) : null;
  const ulbname = userDetails ? userDetails.ulb : null;

  return (
    <div className="overflow-x-hidden px-4 w-full">
      {/* Title bar container */}
      <div className="p-1">
        <TitleBar
          titleBarVisibility={titleBarVisibility}
          titleText={'Approved Application View'}
        />
      </div>

      <div className="mb-1">
        {status && status === 'clicked' && (
          <div>
            {role !== 'Field Officer' && (
              <>
                Update Status -{' '}
                {viewData?.status === 2 ? (
                  <div className="text-green-500">Approved by Admin</div>
                ) : viewData?.status === 0 ? (
                  <div className="text-orange-500">Pending or Not Updated</div>
                // ) : viewData?.status === -1 ? (
                //   <div className="text-red-500">Rejected</div>
                ) : viewData?.status === 1 ? (
                  <div className="text-green-500">
                    Approved by Field Officer
                  </div>
                ) : (
                  <>null</>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 border-b-2 pb-4 p-6 md:p-10 h-auto mb-4 shadow-md w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-10">
          <SubHeading>
            <img src={HomeIcon} alt="employee" width={40} height={20} />
            <span className="ml-3 text-lg sm:text-xl md:text-2xl w-full sm:w-auto">
              Asset & Land Address Details
            </span>
          </SubHeading>
        </div>

        <div>
          <InnerHeading>ULB Name</InnerHeading>
          <p className='text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl'>
            {ulbname }
                  </p>
        </div>

        <div>
          <InnerHeading>Address</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.address ? viewData.address : 'No data found'}
          </p>
        </div>

        <div>
          <InnerHeading>Ward No.</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.ward_no === null ? 'No data found' : viewData.ward_no}
          </p>
        </div>

        <div>
          <InnerHeading>Asset Type</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.type_of_assets === null
              ? 'No data found'
              : viewData.type_of_assets}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto mb-3 shadow-md">
        <SubHeading>
          <img src={HomeIcon} alt="employee" width={40} height={20} />
          <span className="ml-3">Asset order Detail</span>
        </SubHeading>

        <div></div>
        <div></div>

        <div>
          <InnerHeading>Order Number</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.order_no === null ? 'No data found' : viewData.order_no}
          </p>
        </div>

        <div>
          <InnerHeading>Order Date</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.order_date === null
              ? 'No data found'
              : viewData.order_date}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b-2 pb-4 p-10 h-auto shadow-md">
        <SubHeading>
          <img src={HomeIcon} alt="employee" width={40} height={20} />
          <span className="ml-3">Asset Detail</span>
        </SubHeading>

        <div></div>
        <div></div>

        <div>
          <InnerHeading>Asset Category Name</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.type_of_assets === null
              ? 'No data found'
              : viewData.type_of_assets}
          </p>
        </div>

        <div>
          <InnerHeading>Asset Sub-Category Name</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.asset_sub_category_name === null
              ? 'No data found'
              : viewData.asset_sub_category_name}
          </p>
        </div>

        <div>
          <InnerHeading>Asset Category Type</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.assets_category_type === null
              ? 'No data found'
              : viewData.assets_category_type}
          </p>
        </div>

        <div>
          <InnerHeading>Area</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.area === null ? 'No data found' : viewData.area}
          </p>
          {/* <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.area === null ? <>No data found</> : <>{data?.data?.area}</>}</p> */}
        </div>

        <div>
          <InnerHeading>Khata No.</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.area === null ? 'No data found' : viewData.area}
          </p>
        </div>

        <div>
          <InnerHeading>Plot No.</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.plot_no === null ? 'No data found' : viewData.plot_no}
          </p>
        </div>

        <div>
          <InnerHeading>Ward No.</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData.ward_no === null ? 'No data found' : viewData.ward_no}
          </p>
        </div>

        <div>
          <InnerHeading>Type of Land</InnerHeading>
          <p className="text-[#4338CA] mt-2 text-sm sm:text-base md:text-xl">
            {viewData?.type_of_land === null
              ? 'No data found'
              : viewData.type_of_land}
          </p>
          {/* <p className='text-[#4338CA] mt-4 font-bold text-xl'>{data?.data?.type_of_land === null ? <>No data found</> : <>{data?.data?.type_of_land}</>}</p> */}
        </div>
        <div></div>

        <div>
          <InnerHeading>Plot Count</InnerHeading>

          <p className="text-[#4338CA] mt-4 font-bold text-xl">
            {viewData?.floorData[0]?.plotCount === null ? (
              <>No data found</>
            ) : (
              <>
                {viewData?.floorData[0]?.plotCount === 'Building' ? (
                  viewData?.floorData[0]?.plotCount
                ) : (
                  <>No floor found</>
                )}
              </>
            )}
          </p>
          {/* console.log(viewData?.floorData[0]?.plotCount); */}
        </div>

        <div>
          <InnerHeading>Plot Type</InnerHeading>
          <p className="text-[#4338CA] mt-4 font-bold text-xl">
            {viewData?.floorData[0]?.type === null ? (
              <>No data found</>
            ) : (
              <>
                {viewData?.floorData[0]?.type === 'Building' ? (
                  viewData?.floorData[0]?.type
                ) : (
                  <>No floor found</>
                )}
              </>
            )}
          </p>
        </div>

        <div></div>

        <div className="flex flex-col md:flex-row flex-1 gap-6">
          {/* Ownership Document Section */}
          <div>
            <InnerHeading>OwnerShip Document</InnerHeading>
            <div className="flex">
              {viewData?.ownership_doc ? (
                viewData.ownership_doc.endsWith('.pdf') ? (
                  <>
                    <button
                      onClick={() => openModal(viewData.ownership_doc)} // Open PDF in modal
                      className="cursor-pointer"
                    >
                      {/* PDF Icon SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" viewBox="0 0 512 512" fill="none">
                        <g clipPath="url(#clip0_126_4487)">
                          <path d="M435.2 0H76.8C34.3845 0 0 34.3845 0 76.8V435.2C0 477.615 34.3845 512 76.8 512H435.2C477.615 512 512 477.615 512 435.2V76.8C512 34.3845 477.615 0 435.2 0Z" fill="#4338CA" />
                          <path d="M413 302C404 292 384 287 357 287C341 287 324 289 304 292C282.824 272.165 265.232 248.822 252 223C262 193 269 164 269 142C269 125 263 98 239 98C232 98 226 102 222 108C212 126 216 166 235 208C221.121 248.133 204.412 287.231 185 325C132 347 97 371 94 390C92 399 98 414 119 414C150 414 184 369 210 323C240.014 312.679 270.769 304.656 302 299C340 332 373 337 389 337C421 337 424 314 413 302ZM227 111C235 99 253 103 253 127C253 143 248 169 238 199C220 157 220 124 227 111ZM100 391C103 375 133 353 180 334C154 378 128 406 112 406C102 406 99 397 100 391ZM297 293C268.823 298.251 241.079 305.605 214 315C228.801 288.285 240.862 260.142 250 231C263.144 253.463 278.922 274.277 297 293ZM310 297C342 292 369 293 381 295C410 301 400 336 368 328C345 323 326 310 310 297Z" fill="white" />
                        </g>
                        <defs>
                          <clipPath id="clip0_126_4487">
                            <rect width="512" height="512" fill="red" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </>
                ) : (
                  <img
                    className="w-20 h-20 mt-4 cursor-pointer"
                    src={viewData.ownership_doc}
                    alt="ownership document"
                    onClick={() => openModal(viewData.ownership_doc)} // Open image in modal
                  />
                )
              ) : (
                <p className="text-indigo-600 mt-4 font-bold">No document found</p>
              )}
            </div>
          </div>

          {/* Blueprint Section */}
          <div>
            <InnerHeading>BluePrint</InnerHeading>
            {viewData?.blue_print ? (
              viewData.blue_print.endsWith('.pdf') ? (
                <>
                  <button
                    onClick={() => openModal(viewData.blue_print)} // Open PDF in modal
                    className="cursor-pointer"
                  >
                    {/* PDF Icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" viewBox="0 0 512 512" fill="none">
                      <g clipPath="url(#clip0_126_4487)">
                        <path d="M435.2 0H76.8C34.3845 0 0 34.3845 0 76.8V435.2C0 477.615 34.3845 512 76.8 512H435.2C477.615 512 512 477.615 512 435.2V76.8C512 34.3845 477.615 0 435.2 0Z" fill="#4338CA" />
                        <path d="M413 302C404 292 384 287 357 287C341 287 324 289 304 292C282.824 272.165 265.232 248.822 252 223C262 193 269 164 269 142C269 125 263 98 239 98C232 98 226 102 222 108C212 126 216 166 235 208C221.121 248.133 204.412 287.231 185 325C132 347 97 371 94 390C92 399 98 414 119 414C150 414 184 369 210 323C240.014 312.679 270.769 304.656 302 299C340 332 373 337 389 337C421 337 424 314 413 302ZM227 111C235 99 253 103 253 127C253 143 248 169 238 199C220 157 220 124 227 111ZM100 391C103 375 133 353 180 334C154 378 128 406 112 406C102 406 99 397 100 391ZM297 293C268.823 298.251 241.079 305.605 214 315C228.801 288.285 240.862 260.142 250 231C263.144 253.463 278.922 274.277 297 293ZM310 297C342 292 369 293 381 295C410 301 400 336 368 328C345 323 326 310 310 297Z" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0_126_4487">
                          <rect width="512" height="512" fill="red" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </>
              ) : (
                <img
                  className="w-20 h-20 mt-1 cursor-pointer"
                  src={viewData.blue_print}
                  alt="blue print"
                  onClick={() => openModal(viewData.blue_print)} // Open image in modal
                />
              )
            ) : (
              <p className="text-indigo-600 mt-4 font-bold">No document found</p>
            )}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-lg w-full h-full max-w-lg md:max-w-3/4 max-h-3/4 md:h-auto flex flex-col">
                <button
                  className="self-end text-red-600 font-bold mb-2"
                  onClick={closeModal}
                >
                  Close
                </button>

                {/* Scrollable Modal Content */}
                <div className="flex-grow overflow-auto border w-full h-56 border-gray-300">
                  {modalContent?.endsWith('.pdf') ? (
                    <iframe
                      src={modalContent}
                      title="document"
                      className="w-full h-full"
                    ></iframe>
                  ) : (
                    <img
                      src={modalContent}
                      alt="document"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Download Button */}
                <div className="mt-4" >
                  <a
                    href={modalContent} // Link to the document for download
                    download // Enables download functionality
                    className="text-indigo-600 font-bold"
                    target="_blank"
                  >
                    Download Document 
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div></div>

        {viewData?.type_of_assets === 'Building' && (
          <div>
            <InnerHeading>Floor Details</InnerHeading>
            <div className="mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-full">
                {viewData?.floorData?.map((floor) =>
                  floor.details?.map((detail) => (
                    <div
                      key={detail.id}
                      className="bg-white shadow-md rounded-lg p-4"
                    >
                      <p className="text-md font-bold mb-2 pb-1 border-b-2">
                        <span className="text-[#4338CA]">Floor:</span>{' '}
                        {floor.floor}
                      </p>
                      <p className="text-md font-bold mb-2 pb-1 border-b-2">
                        <span className="text-[#4338CA]">Type:</span>{' '}
                        {detail?.type}
                      </p>
                      <p className="text-md font-bold mb-2 pb-1 border-b-2">
                        <span className="text-[#4338CA]">Type of Plot:</span>{' '}
                        {detail?.type_of_plot}
                      </p>
                      <p className="text-md font-bold mb-2 pb-1 border-b-2">
                        <span className="text-[#4338CA]">Plot:</span>{' '}
                        {detail.index}
                      </p>
                      <p className="text-md font-bold mb-2 pb-1 border-b-2">
                        <span className="text-[#4338CA]">Length:</span>{' '}
                        {detail.length}
                      </p>
                      <p className="text-md font-bold mb-2 pb-1 border-b-2">
                        <span className="text-[#4338CA]">Breadth:</span>{' '}
                        {detail.breadth}
                      </p>
                      <p className="text-md font-bold mb-2 pb-1 border-b-2">
                        <span className="text-[#4338CA]">Height:</span>{' '}
                        {detail.height}
                      </p>
                      <p className="text-md font-bold pb-1">
                        <span className="text-[#4338CA]">Name:</span>{' '}
                        {detail.name}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* xcvbnm,.xcvgbhjklfghjk */}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center w-full py-4 mt-1 sm:p-8">
        <ImageUploader />
      </div>

      
    </div>
  );
};

export default ViewByIdList;
