import  { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import TitleBar from '../../Others/TitleBar';
import { contextVar } from "@/Components/context/contextVar";

const validationSchema = Yup.object({
    ulbName: Yup.string().required('ULB Name is required'),
    schemeName: Yup.string().required('Scheme Name is required'),
    SchemeWise: Yup.number().required('Scheme Wise Fund is required').positive('Must be a positive number'),
    ApprovedProjectStatus: Yup.string().required('Approved Project complition is required'),
    department: Yup.string().required('Department is required'),
    ApprovedAmountStatus: Yup.string().required('Approved Amount Status is required'),
   cityType: Yup.string().required('CITY  type  is required'),
    reporType: Yup.string().required('Report type  is required'),

});

const SudaScheme_Dtl = () => {
    const { titleBarVisibility } = useContext(contextVar);

    const initialValues = {
        schemeName: '',
        SchemeWise: '',
        ApprovedProjectStatus: '',
        department: '',
        ulbName: '',
        ApprovedAmountStatus:'',
        cityType: '',
        reporType: '',

    };

    const handleSubmit = (values) => {
        console.log('Form Submitted:', values);
        // Add form submission logic here
    };

    return (
        <>
            <div className="p-4">
                <TitleBar
                    titleBarVisibility={titleBarVisibility}
                    titleText={"SUDA Scheme Details  "}
                />

                <div className="w-full rounded-md p-4 border border-blue-500 mt-6 shadow-lg">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema} // Add validationSchema here
                        onSubmit={handleSubmit}
                    >
                        {({ resetForm }) => (
                            <Form>
                                <div className="bg-indigo-700 p-2 rounded-md mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 15 14" fill="none">
                                        <rect x="0.982" y="0.541" width="13.191" height="13.191" fill="url(#pattern0)" />
                                        <defs>
                                            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                                <use xlinkHref="#image0" transform="scale(0.015625)" />
                                            </pattern>
                                            <image id="image0" width="64" height="64" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADeklEQVR4nO2a20sUYRjGH2+sm7roRF2UhYZ3gewEFXSwBBfz3/DevHChJLvLwJQOULKm4boGQkhFrofVdjfEuokKgrRUKDLIMNoNw2p7480Zd1bdmdndOenMA8/NsjPzPr/v+95vZhjAlStXrly5cuUqB9HQiYMUrhihJ1ULFKmmvDzqJQoiG8epG30UQCksCz9aFc87uOTBI9kCkDxP97DXfADhipG0AM9qiCZuEk3dXeEOouc16gDu78oVALvX8MC9jSgc8OHKQD1mB3ygPyPeVPFvrxElFymjfn5WDv+oNJ/w9DsA4ppCPnwK1aOJa9UdQKgeTXwRyWkj//dX5vCZAPCa52mf38gvW14b15p34PaysSK/Jxr2C9HFdiFGj2u3p11kOQhPe0nzL4jeNKX71UWihyW6hNQKoP/cNuKauXa/Jzrc5nm6L2sAfk80zCeRLL9AGoCZnhSA15cMD6oFAFtee7sQG8p+BgixhCYA010pAC/P2xKA3xON5zIDhhUBSGs45CFKTC/ZhKlu3gwoGyviA1M9YEc6AIuCauoBtTtTPUCIDebUA1R3ARsDCPlwGXqrtxGFDIH3WrsCMPQ+YKUm60B2MszWpA1CuwDq3BlAli0BCmLc6sYnt/kAunCAgph1LAAWdaPc2QA6sdnZAHpwOlNBX26BIhdW36Nn60gDaO72OuwBkYb8w8sh2A9AUHkXcAKApFJBPG31gKBxCSStAEA28riTAcxyP3IygJOmh2epFaa2DWrd3lTdj02wQqRSmJYGqKW7qzqAU84GELRpD5hT2QZ1WwJLdvQuQFbdByRtEHzZVgAYdzaALuWHoQ3/NKj2QmTDPwypvRBxBoCezC9ETH4atF8PoA3fBIPW7wI/OkAfb4Det9jwhQgZ7K9toInmlK0AQFaOvDy8owAsdIKmWtcZgMQd0IfroHctqwvXy1YAiGsJz1uYUaFljpsPoBt9WkbehPA0eRUPzAcQQOn/D5UVAPC0NwHAt5lW7DcdAIu/0uYPlSmI72sBMHLNTzQjwSNvWXhXrhRVAGArgD0ASgAcAnAMwHEA5QAqAFQCOCu6UvytXPzPUfGYYvEcW8Rz2loFYrGHAXgBVOtsr3ju3XaFIRgQOpP5WraT4HQABeL0FAxcAoJ4jXXVBIvFhsaNTWqCZ9ZogvzbWk2QAxvWBP8BY0RUz7NE7WQAAAAASUVORK5CYII=" />
                                        </defs>
                                    </svg>
                                    <h1 className="text-xl font-bold text-white ml-2">SUDA Scheme Details </h1>
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label htmlFor="ulbName" className="block p-2">ULB </label>
                                        <Field as="select" id="tenderFloated" name="ulbName" className="p-2 border rounded-md w-full">
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </Field>
                                        <ErrorMessage name="ulbName" component="div" className="text-red-500 text-sm" />
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label htmlFor="schemeName" className="block p-2">Scheme Name</label>
                                        <Field id="schemeName" name="schemeName" type="text" className="p-2 border rounded-md w-full" />
                                        <ErrorMessage name="schemeName" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="SchemeWise" className="block p-2">Scheme wise Fund Release </label>
                                        <Field id="SchemeWise" name="SchemeWise" type="text" className="p-2 border rounded-md w-full" />
                                        <ErrorMessage name="SchemeWise" component="div" className="text-red-500 text-sm" />
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label htmlFor="ApprovedProjectStatus" className="block p-2">Approved Project </label>
                                        <Field as="select" id="ApprovedProjectStatus" name="ApprovedProjectStatus" className="p-2 border rounded-md w-full">
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </Field>
                                        <ErrorMessage name="ApprovedProjectStatus" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="department" className="block p-2">Department</label>
                                        <Field id="department" name="department" type="text" className="p-2 border rounded-md w-full" />
                                        <ErrorMessage name="department" component="div" className="text-red-500 text-sm" />
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label htmlFor="ApprovedAmountStatus" className="block p-2">Approved Amount of Scheme</label>
                                        <Field id="ApprovedAmountStatus" name="ApprovedAmountStatus" type="text" className="p-2 border rounded-md w-full" />
                                        <ErrorMessage name="ApprovedAmountStatus" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="cityType" className="block p-2">City Type</label>
                                        <Field as="select" id="cityType" name="cityType" className="p-2 border rounded-md w-full">
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="no">No</option>

                                        </Field>
                                        <ErrorMessage name="cityType" component="div" className="text-red-500 text-sm" />
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label htmlFor="reporType" className="block p-2">Report Type</label>
                                        <Field as="select" id="reporType" name="reporType" className="p-2 border rounded-md w-full">
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>

                                        </Field>
                                        <ErrorMessage name="reporType" component="div" className="text-red-500 text-sm" />
                                    </div>
                                   
                                </div>

                             

                                {/* <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label htmlFor="financialProgress" className="block p-2">Financial Progress</label>
                                        <Field id="financialProgress" name="financialProgress" type="text" className="p-2 border rounded-md w-full" />
                                        <ErrorMessage name="financialProgress" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="financialProgressPercentage" className="block p-2">Financial Progress in Percentage</label>
                                        <Field id="financialProgressPercentage" name="financialProgressPercentage" type="text" className="p-2 border rounded-md w-full" />
                                        <ErrorMessage name="financialProgressPercentage" component="div" className="text-red-500 text-sm" />
                                    </div>
                                </div> */}

                                <div className="flex justify-between">
                                    <div className='flex justify-start'>
                                        <button type="button" onClick={() => resetForm()} className="border border-[#4338ca] bg-[#4338ca] hover:bg-[#342b96] text-white px-10 py-2 rounded mb-5">Reset</button>

                                    </div>
                                    <div className='flex justify-end gap-2'>
                                        <button type="button" onClick={() => window.history.back()} className="border border-[#4338ca] bg-[#4338ca] hover:bg-[#342b96] text-white px-10 py-2 rounded mb-5">Back</button>
                                        <button type="submit" className="border border-[#4338ca] bg-[#4338ca] hover:bg-[#342b96] text-white px-10 py-2 rounded mb-5">Save & Next</button>

                                    </div>

                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default SudaScheme_Dtl;
