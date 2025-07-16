///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : Change Password
// 👉 Status      : Open
// 👉 Description : To change the password 
// 👉 Functions   :  
//                  1. handleChangeInput   -> Handle change to event to restrict useless input
//                  2. handleSubmit        -> Submit final data
///////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast';
import './login.css'
import ProjectApiList from '@/Components/api/ProjectApiList';
import { RotatingLines } from "react-loader-spinner";
import { allowNumberInput } from '@/Components/Common/PowerupFunctions';
import ApiHeader from '@/Components/api/ApiHeader';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import useSetTitle from '@/Components/Common/useSetTitle';

const ChangePassword = () => {

    //  👉 Destructuring Api List 👈 
    const { api_changePassword, api_forgotPassword } = ProjectApiList()

    const navigate = useNavigate(); // 👉 Navigation Constant 👈 

    // 👉 State constants 👈
    const [loaderStatus, setLoaderStatus] = useState(false) // 👉 Loader 👈
    const [showMsg, setShowMsg] = useState() // 👉 Store response message 👈 

    useSetTitle("Change Password")

    // 👉 Validation Schema 👈
    const schema = Yup.object().shape({
        oldPassword: Yup.string().required("Enter old password"),
        newPassword: Yup.string().min(6, 'Minimum six character !')
            .max(50, 'Too Long!')
            .required('Enter new password !')
            .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/, 'Password Must Contains (Capital, Smail, Number, Special) eg - Abc123#.'),
        matchNewPassword: Yup.string().required("Confirm your new password").oneOf([Yup.ref('newPassword'), null], 'Password not match')
    });

    // 👉 Initial Values for form 👈
    const initialValues = {
        oldPassword: '',
        newPassword: '',
        matchNewPassword: ''
    }

    // 👉 Formik state 👈
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: (values) => {
            console.log("post data", values)
            handleSubmit(values)
        }
    });

    // 👉 Submission Function 👈
    const handleSubmit = (values) => {

        let body = {
            password: values.oldPassword,
            newPassword: values.newPassword
        }

        console.log('request body before hit api => ', body)

        setLoaderStatus(true)

        AxiosInterceptors.post(type == 'change' ? api_changePassword : api_forgotPassword, body, ApiHeader())
            .then((res) => {
                if (res?.data?.status == true) {
                    console.log("successfully changed => ", res)
                    toast.success('Password changed successfully !!!')
                    type == 'change' ? navigate('/home') : navigate('/login')
                }


                if (res?.data?.status == false) {
                    toast.error('Please try after sometime !!!')
                    setShowMsg(res?.data?.message)
                }

                setLoaderStatus(false)
            })
            .catch((err) => {
                console.log("change pwd error  => ", err)
                setLoaderStatus(false)
                setShowMsg('Server Error !!!')
            })
    }

    // 👉 Function 2 : Handle change input for mobile no. digits restriction 👈
    const handleChangeInput = (event) => {
        let name = event.target.name
        let value = event.target.value

        { name == 'mobile' && formik.setFieldValue("mobile", allowNumberInput(value, formik.values.mobile, 10)) }
    }


    return (
        <>

            <div className='flex justify-center items-center mt-10'>

                {/* ══════════════════════════════║🔰 FORM 🔰║═══════════════════════════════════  */}
                <form onChange={handleChangeInput} className="w-[30rem] px-8 rounded-lg bg-white shadow-xl mx-4 md:mx-0">
                    <div className='grid grid-cols-12  md:px-0 '>
                        <div className='w-full col-span-12 md:col-span-12 md:shadow-none py-10'>
                            <div className='w-full  py-6  text-gray-700'>

                                {/* HEADING */}
                                <h1 className='text-center font-semibold my-1 flex justify-center'>
                                    <span className='px-1 text-indigo-500 text-semibold text-2xl poppins uppercase'>Change Password</span>
                                </h1>

                                {/* Here type == 'changes' condition used to handle reset and change password */}
                                <div className='my-3 relative text-sm'>
                                    <div className='text-gray-600 static mb-1 font-semibold text-left poppins'>Old Password</div>
                                    <div className='flex flex-row flex-wrap gap-x-2 gap-y-2'>
                                        <input
                                            type="password"
                                            {...formik.getFieldProps('oldPassword')}
                                            className='form-control px-3 text-xs 2xl:text-sm py-1 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-md poppins w-full'
                                            placeholder="Enter Your Old Password"
                                        />

                                        <div className='w-full text-start'>
                                            <span className="text-red-600 text-xs poppins text-start">{formik.touched.oldPassword && formik.errors.oldPassword ? formik.errors.oldPassword : null}</span>
                                        </div> </div>
                                </div>

                                <div className='my-3 relative text-sm'>
                                    <div className='text-gray-600 static mb-1 font-semibold text-left poppins'>New Password</div>
                                    <div className='flex flex-row flex-wrap gap-x-2 gap-y-2'>
                                        <input
                                            type="password"
                                            {...formik.getFieldProps('newPassword')}
                                            className='form-control px-3 text-xs 2xl:text-sm py-1 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-md poppins w-full'
                                            placeholder="Enter Your New Password"
                                        />

                                        <div className='w-full text-start'>
                                            <span className="text-red-600 text-xs poppins text-start">{formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : null}</span>
                                        </div> </div>
                                </div>

                                <div className='my-3 relative text-sm'>
                                    <div className='text-gray-600 static mb-1 font-semibold text-left poppins'>Confirm New Password</div>
                                    <div className='flex flex-row flex-wrap gap-x-2 gap-y-2'>
                                        <input
                                            type="password"
                                            {...formik.getFieldProps('matchNewPassword')}
                                            className='form-control px-3 text-xs 2xl:text-sm py-1 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-md poppins w-full'
                                            placeholder="Confirm your new password"
                                        />

                                        <div className='w-full text-start'>
                                            <span className="text-red-600 text-xs poppins text-start">{formik.touched.matchNewPassword && formik.errors.matchNewPassword ? formik.errors.matchNewPassword : null}</span>
                                        </div> </div>
                                </div>

                                <div className=' my-10'>
                                </div>
                                <div className='text-center mt-3 text-xs'>

                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className='my-5 relative'>
                                    <div className='text-red-600 text-sm font-semibold my-3 '> <span className=''> {showMsg}</span></div>

                                    {/* loaderStatus is to handle response loading */}
                                    {loaderStatus ?
                                        <div className='flex w-full justify-center'>
                                            <RotatingLines
                                                strokeColor="grey"
                                                strokeWidth="5"
                                                animationDuration="0.75"
                                                width="25"
                                                visible={true}
                                            />
                                        </div>
                                        : <button
                                            type="submit"
                                            onClick={formik.handleSubmit}
                                            disabled={loaderStatus}
                                            className=' bg-indigo-500 hover:bg-indigo-700 px-5 shadow-xl py-2 w-full  rounded-md text-white text-lg font-semibold'>
                                            Submit
                                        </button>
                                    }


                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </>
    )
}

export default ChangePassword