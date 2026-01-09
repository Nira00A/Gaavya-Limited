import { useEffect, useState, createContext, useContext } from 'react'
import { useLoading } from '../../context/loadingContext'
import adminApi from '../../axiosApi/adminApi'

export const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null)
    const { startLoading, stopLoading } = useLoading()
    const [isAdminLoading, setIsAdminLoading] = useState(true)

    useEffect(() => {
        const initAdminAuth = async () => {
            try {
                const res = await adminApi.get('/auth/check');
                
                setAdmin(res.data.admin);
            } catch (error) {
                setAdmin(null);
            } finally {
                setIsAdminLoading(false);
            }
        };
        initAdminAuth();
    }, []);

    const loginAdmin = async (admin_email, admin_password) => {
        startLoading()
        try {
            if (!admin_email || admin_email.trim() === '' || !admin_password || admin_password.trim() === '') {
                return ({
                    success: false,
                    text: 'Email or password is empty'
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(admin_email)) {
                return {
                    success: false,
                    text: 'Please enter a valid email address'
                };
            }

            const response = await adminApi.post('/login', { admin_email, admin_password })

            const data = response.data

            if (data.success) {
                setAdmin(data.admin)
            }

            return {
                success: data.success,
                text: 'Login successful!',
                admin: data.admin
            };

        } catch (error) {
            console.log("Admin Context Login Error", error)
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            }
        } finally {
            stopLoading()
        }
    }

  {/*  const registerAdmin = async (admin_email, admin_password) => {
        startLoading()
        try {
            if (!admin_email || !admin_password) {
                return ({ success: false, text: 'Fields cannot be empty' })
            }

            const response = await adminApi.post('/register', { admin_email, admin_password })
            const data = response.data

            return {
                success: true,
                text: data.text || 'OTP sent successfully'
            };

        } catch (error) {
            console.log("Admin Context Register Error", error)
            return {
                success: false,
                text: error.response?.data?.error || 'Registration failed'
            }
        } finally {
            stopLoading()
        }
    }

    const verifyAdminOtp = async (admin_email, verificationCode) => {
        startLoading()
        try {
            const response = await adminApi.post('/verify/email', { admin_email, verificationCode })
            const data = response.data

            if (data.success) {
                setAdmin(data.admin) 
            }

            return {
                success: true,
                text: 'Verification successful!',
                admin: data.admin
            };
        } catch (error) {
            console.log("Admin Context Verify Error", error)
            return {
                success: false,
                text: error.response?.data?.text || 'Verification failed'
            }
        } finally {
            stopLoading()
        }
    }
*/}

    const logoutAdmin = async () => {
        try {
            const response = await adminApi.post('/logout', {})
            if(response.data.success){
                return response.data
            }
        } catch (error) {
            return error
        } finally {
            setAdmin(null)
        }
    }

    return (
        <AdminContext.Provider value={{ 
            admin, 
            isAdminLoading, 
            loginAdmin, 
            logoutAdmin 
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export const useAdmin = () => useContext(AdminContext)