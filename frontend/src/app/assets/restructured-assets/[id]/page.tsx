import React from 'react';
import RestructuredAssetsView from '@/components/JuidcoAssets/pages/Ems/RestructuredAssetsView';
import PageLayout from '@/components/Layouts/PageLayout';

const page = ({params} : {params:{id:number}})  => {
    const { id } = params;
  return (
          <PageLayout>
              <RestructuredAssetsView id={id} />
          </PageLayout>
  )
}

export default page
