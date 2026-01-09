import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter , Outlet, RouterProvider} from 'react-router-dom'
import BasicOutlet from './outlets/BasicOutlet';
import Home from './Home/home';
import About from './About/About';
import PrivacyPolicy from './About/Privacy';
import TermsOfService from './About/Terms';
import Products from './Product/ProductPage';
import { CartProvider } from './context/cartContext';
import Cart from './Product/cart';
import Register from './Auth/register';
import Login from './Auth/login';
import {ProductView} from './Product/ProductView';
import { CartPopup } from './Product/CartPopup';
import { AuthProvider } from './context/authContext';

import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainProfile from './Profile/MainProfile';
import { ProfileProvider } from './context/profileContext';
import { LoadingProvider } from './context/loadingContext';
import NotFound from './NoFound/404NotFound';
import AdminDashboard from './Admin/admin';
import { AdminProtection } from './Admin/ProtectedRoute';
import AdminOutlet from './outlets/adminOutlet';
import NotFoundAdmin from './Admin/404NotFoundAdmin';
import { AdminProvider } from './Admin/adminContext/adminAuthContext';
import AdminLogin from './Admin/adminLogin';
import AdminRegister from './Admin/adminRegister';
import CategoryManager from './Admin/adminCategory';
import ProductManager from './Admin/adminProducts';
import { ProductProvider } from './context/productContext';
import AdminCoupons from './Admin/adminCoupons';
import { CouponProvider } from './context/couponContext';
import { QualityReport } from './QualityReport/QualityReport';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Approutes = () =>{
  const router = createBrowserRouter([
    {
      path: '/',
      element: 
      <AuthProvider>
        <ProfileProvider>
          <CartProvider>
            <ProductProvider>
              <CouponProvider>
                <BasicOutlet />
              </CouponProvider>
            </ProductProvider>
            </CartProvider>
        </ProfileProvider>
      </AuthProvider>,
      children:[
        {index: true,element: <Home />},
        {path: '/about',element: <About />},
        {path: '/privacy',element: <PrivacyPolicy />},
        {path: '/terms',element: <TermsOfService />},
        {path: '/product',element: <Products />},
        {path: '/product/:id',element: <ProductView />},
        {path: '/cart',element: <Cart />},
        {path: '/login',element: <Login />},
        {path: '/register',element: <Register />},
        {path: '/quality_report', element: <QualityReport />},
        {path: '/profile',element: <MainProfile />},
        {path: '*',element: <NotFound />
        }]
    },
    {
      path: '/',
      element: 
      <AdminProvider>
        <Outlet />
      </AdminProvider>,
      children:[
        {
          path:'/admin',
          element: (
          <AdminProtection>
            <AdminOutlet />
          </AdminProtection>
          ),
          children: [
            {index: true , element: <AdminDashboard />},
            {path: 'categories' , element: <CategoryManager />},
            {path: 'products' , element: <ProductManager />},
            {path: 'coupons' , element: <AdminCoupons />},
            {path: '*' , element: <NotFoundAdmin />},
          ]},
        {path: '/admin/login',element: <AdminLogin />},
      ]
    },
    {path: '*' , element: <NotFoundAdmin />},
])

  return <RouterProvider router={router} />
}

root.render(
  <React.StrictMode>
    <LoadingProvider>
      <Approutes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />  
    </LoadingProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
