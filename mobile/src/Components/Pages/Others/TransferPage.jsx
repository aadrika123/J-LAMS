import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom' 
import ApiHeader from '@/Components/api/ApiHeader'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import ProjectApiList from '@/Components/api/ProjectApiList';
import { contextVar } from '@/Components/context//contextVar'
import { setLocalStorageItemStrigified } from '@/Components/Common/localstorage'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'


function TransferPage() {
  const [isLoading, setisLoading] = useState(false)
  const navigate = useNavigate()
  const { api_getFreeMenuList } = ProjectApiList()
  const { setmenuList } = useContext(contextVar)


  useEffect(() => {
    let token = window.localStorage.getItem('token')
    setisLoading(true)
    if (token == null) {
      navigate('/')
      return
    }
    fetchMenuList()

  }, [])

  // 3 CHANGE FOR SINGLE AUTH
  const fetchMenuList = () => {
    let requestBody = {
      moduleId: 5
    }

    console.log('api header to login...')
    AxiosInterceptors.post(api_getFreeMenuList, requestBody, ApiHeader())
      .then(function (response) {
        console.log('fetched menu list.....', response)
        // return
        if (response.data.status == true) {
          setLocalStorageItemStrigified('menuList', response?.data?.data?.permission)
          setLocalStorageItemStrigified('userName', response?.data?.data?.userDetails?.userName)
          setLocalStorageItemStrigified('roles', response?.data?.data?.userDetails?.roles)
          setLocalStorageItemStrigified('userUlbName', response?.data?.data?.userDetails?.ulb)
          setLocalStorageItemStrigified('userMobile', response?.data?.data?.userDetails?.mobileNo)
          setLocalStorageItemStrigified('userEmail', response?.data?.data?.userDetails?.email)
          setLocalStorageItemStrigified('userImage', response?.data?.data?.userDetails?.imageUrl)
          setmenuList(response?.data?.data?.permission)
          navigate('/home')

        } else {
          console.log('false...')
          // seterrorMsg(response.data.message)
          // notify(response.data.message, 'error') //toast message if wrong credentails
        }
        setisLoading(true)
      })
      .catch(function (error) {
        // setLoaderStatus(false)
        // seterroState(true)
        console.log('--2--login error...', error)
        setisLoading(true)
      })


  }

  if (isLoading) {
    return (
      // <BrandLoader />
      <BarLoader />
    )
  }
}

export default TransferPage