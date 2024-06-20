import React from 'react';
import View from '@/components/JuidcoAssets/pages/Ems/View/Index';
import PageLayout from '@/components/Layouts/PageLayout';

const page = ({params} : {params:{id:number}})  => {
    const { id } = params;
  return (
          <PageLayout>
              <View id={id} />
          </PageLayout>
  )
}

export default page
