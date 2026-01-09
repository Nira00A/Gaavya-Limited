import Footer from '../Footer/footer'
import Header from '../Header/header'
import { Outlet } from 'react-router-dom'
import { CartPopup } from '../Product/CartPopup'
import { useLocation } from 'react-router-dom'
import MobileScrollBar from '../Header/mobileScrollBar'

function BasicOutlet() {
  const hideList = ['/administration']
  const location = useLocation()

  const headerToggle = !hideList.includes(location.pathname)

  return (
    <div>
        <header className='relative'>
            {headerToggle && <Header />}
            <MobileScrollBar />
        </header>

        <main>
            <Outlet />
            {headerToggle && <CartPopup />}
        </main>

        <footer>
            {headerToggle && <Footer />}
        </footer>
    </div>
  )
}

export default BasicOutlet