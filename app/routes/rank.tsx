import DefaultLayout from '@layouts/DefaultLayout'
import { Outlet } from '@remix-run/react'


const RankParent = () => {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  )
}

export default RankParent
