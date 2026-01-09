import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/loadingContext';
import { useAuth } from '../context/authContext';
import { useProf } from '../context/profileContext';
import { toast } from 'react-toastify';
import CanOrderPopup from './canOrderPopup';
import api from '../axiosApi/api';

export const LocationPage = () => {
  const [detecting, setDetecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [canOrder , setCanOrder] = useState(false)
  const { startLoading, stopLoading } = useLoading();
  const { address, setAddress , locationDelete} = useProf();
  const { user } = useAuth();

  // Local state for the single address form
  const [formData, setFormData] = useState({
    full_address: '',
    landmark: '',
    pincode: '',
    latitude: null,
    longitude: null
  });

  const handleDetect = () => {
    setDetecting(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({ ...formData, latitude: position.coords.latitude, longitude: position.coords.longitude });
        setDetecting(false);
        toast.success("Location Pinpointed!");
      },
      () => {
        setDetecting(false);
        toast.error("Could not detect location. Please enable location in chrome.");
      }
    );
  };

  const handleSaveAddress = async () => {
    try {
        if(formData.pincode.length !== 6){
            toast.error('Enter a valid pincode')
            return
        }

        if (formData.full_address.trim() === '' || formData.landmark.trim() === ''){
            toast.error('Enter a valid Address or Landmark')
            return
        }

        startLoading();
        const response = await api.post('/location/post', {full_address: formData.full_address , landmark: formData.landmark , pincode: formData.pincode , latitude: formData.latitude , longitude: formData.longitude});
        if (response.data.success) {
            setAddress(response.data.user_address);
            setIsEditing(false); 
            toast.success("Address Saved!");

            if(response.data.user_address.can_order === false){
                setCanOrder(true)
            }
        }
    } catch (error) {
      toast.error(error.response?.data?.error || "Save failed");
    } finally {
      stopLoading();
    }
  };

  const handleLocationDelete = async () => {
    try {
        const response = await locationDelete()

        if (response.success){
            toast.success(response.text)
        }
    } catch (error) {
        toast.error(error.response?.data?.error || "Deletion failed");
    }
  }

  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;
      startLoading();
      try {
        const response = await api.get('/location/get');
        if (response.data.success) {
          setAddress(response.data.user_address);
        } else {
           setAddress(null);
        }
      } catch (error) {
        toast.error(error)
      } finally {
        stopLoading();
      }
    };
    fetchAddress();
  }, [user]);

  return (
    <div className='flex flex-col gap-10'>
        <CanOrderPopup isOpen={canOrder} onClose={()=>setCanOrder(false)}/>
        
        <div className='text-xl font-bold'>
            Manage Address
        </div>

        {/*No Address and Not Editing */}
        {!address && !isEditing && (
          <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-sm text-gray-500 mb-6 font-medium">No delivery address added yet.</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-xs  shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
            >
              + Add Address
            </button>
          </div>
        )}

        {/*Address Exists and Not Editing */}
        {address && !isEditing && (
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-100 mb-6">
            <div className="flex justify-between items-start mb-2">
               <span className="text-[10px]  uppercase tracking-widest text-green-600">Current Address</span>
               <button onClick={handleLocationDelete} className="text-xs  text-red-400 hover:text-red-600">Delete</button>
            </div>
            <p className=" text-gray-800">{address.full_address}</p>
            <p className="text-sm text-gray-600">{address.landmark}, {address.pincode}</p>
            <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-green-600 text-white py-2 rounded-lg text-sm  mt-6"
            >
                Change
            </button>
          </div>
        )}

        {/*The Form (Adding or Updating) */}
        {isEditing && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <button 
              onClick={handleDetect}
              className="w-full flex items-center justify-center gap-3 border-2 border-green-600 text-green-600 py-4 rounded-lg  active:scale-95 transition-all"
            >
              {detecting ? "Detecting..." : formData.latitude && formData.longitude ? "Location Detected" : "Detect Precise Location"}
            </button>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="House No / Flat / Street"
                className="w-full p-4 text-sm bg-gray-50 rounded-lg font-semibold outline-none border-2 border-transparent focus:border-green-200"
                value={address?.full_address}
                onChange={(e) => setFormData({...formData, full_address: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Landmark (e.g. Near Shiv Mandir)"
                className="w-full text-sm p-4 bg-gray-50 rounded-lg font-semibold outline-none"
                value={address?.landmark}
                onChange={(e) => setFormData({...formData, landmark: e.target.value})}
              />
              <input 
                type="number" 
                inputMode="numeric"
                placeholder="Pincode"
                className="w-full text-sm p-4 bg-gray-50 rounded-lg font-semibold outline-none"
                value={address?.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              />
            </div>

            <div className="flex gap-3">
               <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-lg font-bold">Cancel</button>
               <button onClick={handleSaveAddress} className="flex-[2] bg-green-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-green-100">Save Address</button>
            </div>
          </div>
        )}
    </div>
  );
};