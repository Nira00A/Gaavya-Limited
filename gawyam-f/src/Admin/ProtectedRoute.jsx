import { Navigate } from "react-router-dom"
import { useAdmin } from "./adminContext/adminAuthContext"

export const AdminProtection = ({children}) => {
    const { admin  , isAdminLoading} = useAdmin()

    if (isAdminLoading) {
        return <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-blue-800 font-bold animate-pulse">Loading...</p>
          </div>
        </div>
    }
    
    if (!admin){
      return <Navigate to='/admin/login' />
    }
    
    return children
}