import Aside from '@components/Aside'
import Footer from '@components/Footer'

interface Props {
  children?: React.ReactNode
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <>
      <Aside />
      <main className='h-full w-5/6 overflow-y-auto'>{children}</main>
      <Footer />
    </>
  )
}

export default DefaultLayout
