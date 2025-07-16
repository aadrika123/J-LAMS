import React from 'react';
import AdiminApprovedView from '@/components/JuidcoAssets/pages/Ems/AdminApprovedView/index';
import PageLayout from '@/components/Layouts/PageLayout';

const page = ({params} : {params:{id:number}})  => {
    const { id } = params;
  return (
          <PageLayout>
              <AdiminApprovedView id={id} />
          </PageLayout>
  )
}

export default page
