import React, { useEffect, useState } from 'react'
import { useProf } from '../context/profileContext'
import {toast} from 'react-toastify'

function ProfileInformation() {
  const { profile , setProfile , profileEdit} = useProf()
  const [nameEdit , setNameEdit] = useState(false)
  const [mobileEdit , setMobileEdit] = useState(false)

  const handleSave = async () => {
    try {
      const response = await profileEdit(profile.name , profile.phoneno)
      toast.success(response.text)
      setNameEdit(false)
      setMobileEdit(false)
    } catch (error) {
      toast.error(error.code)
    } 
  }

  const handleDeactivate = () => {
    console.log('Deactivate')
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className='text-xl font-bold'>
        Profile Information
      </div>

      <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-10 items-center select-none'>
            <div className='text-base'>
              Profile Name
            </div>
            <button 
              onClick={() => nameEdit ? handleSave() : setNameEdit(true)}
              className={`${nameEdit ? 'bg-green-600 text-sm text-white' : 'text-sm bg-gray-100 text-gray-600'} px-6 py-2 rounded-lg font-bold text-xs transition-all active:scale-95`}
            >
              {nameEdit ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
          {nameEdit ? (
          <input 
            type="text" 
            className="w-full p-2 border-b-2 border-green-600 outline-none bg-green-50/30 font-semibold text-gray-700"
            value={profile?.name || ''}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
          />
        ) : (
          <p className="select-none text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 transition-all">
            {profile?.name}
          </p>
        )}
      </div>

      <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-10 items-center select-none'>
            <div className=''>
              Email
            </div>
          </div>
          <p className="select-none text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 transition-all">
            {profile?.email}
          </p>
        
      </div>

      <div className='flex flex-col gap-6'>
          <div className='flex flex-row gap-10 items-center select-none'>
            <div className=''>
              Mobile Number
            </div>
            <button 
              onClick={() => mobileEdit ? handleSave() : setMobileEdit(true)}
              className={`${mobileEdit ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'} px-6 py-2 rounded-lg font-bold transition-all text-xs active:scale-95`}
            >
              {mobileEdit ? 'Save' : 'Edit Profile'}
            </button>
          </div>
          {mobileEdit ? (
          <input 
            type="number" 
            className="w-full p-2 border-b-2 border-green-600 outline-none bg-green-50/30 font-semibold text-gray-700"
            value={profile?.phoneno || ''}
            onChange={(e) => setProfile({...profile, phoneno: e.target.value})}
          />
        ) : (
          <p className="select-none text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 transition-all">
            {profile?.phoneno}
          </p>
        )}
      </div>

      <div className="">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">FAQs</h3>
        
        <div className="flex flex-col gap-5">
          {/* FAQ Item 1 */}
          <div className="group">
            <p className="text-sm font-bold text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
              How do I track my milk delivery?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              You can track your live delivery status in the 'Orders' section of the app every morning.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className="group">
            <p className="text-sm font-bold text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
              Can I pause my subscription?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Yes, use the 'Pause' button in Subscriptions. Delivery stops from the next morning.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div className="group">
            <p className="text-sm font-bold text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
              Is the milk fresh and organic?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Absolutely! Gavyam sources milk directly from local farms with zero preservatives.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 pt-6 border-t border-red-50">
          <button 
            onClick={() => window.confirm("Are you sure? This will delete your Gavyam account data.") && handleDeactivate()}
            className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-tighter transition-all"
          >
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileInformation