import React, { useEffect, useState } from 'react';
import adminApi from '../axiosApi/adminApi';
import { toast } from 'react-toastify';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState(null);

  // Form State (Now includes Quality Fields)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    serving_options: '',
    // Quality Fields
    shelf_life: '',
    storage_tips: '',
    sourcing_origin: '',
    allergen_info: '',
    best_suited_for: '', // We'll take this as a comma-separated string
  });
  
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await adminApi.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- CLOUDINARY UPLOAD ---
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Product_images"); 
    
    // Note: Add 'cloud_name' if your preset requires context, usually preset is enough for unsigned
    // but the URL needs your cloud name:
    const cloudName = "dpbzzbag3"; 
    
    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: data
        });
        const result = await res.json();
        return result.secure_url;
    } catch (error) {
        throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Images
      const mainUrl = await uploadToCloudinary(mainImage);
      const galleryPromises = Array.from(gallery).map(file => uploadToCloudinary(file));
      const galleryUrls = await Promise.all(galleryPromises);

      // 2. Send to Backend
      await adminApi.post('/products', {
        ...formData,
        main_image_url: mainUrl,
        gallery_images: galleryUrls
      });

      toast.success("Product Added Successfully!");
      setIsFormOpen(false);
      
      // Reset Form
      setFormData({
        name: '', description: '', price: '', stock_quantity: '', category_id: '', serving_options: '',
        shelf_life: '', storage_tips: '', sourcing_origin: '', allergen_info: '', best_suited_for: ''
      });
      setMainImage(null);
      setGallery([]);
      
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if(!window.confirm("Delete this product?")) return;
    try {
        await adminApi.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchProducts();
    } catch(err) {
        toast.error("Error deleting");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory <span className='max-[650px]:hidden'>Management</span></h1>
        <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm flex items-center gap-2 transition"
        >
            <span className='max-[650px]:text-sm'>+ Add New Product</span>
        </button>
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between">
                <h2 className="text-xl font-bold text-gray-800">Add Product</h2>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-red-500 text-xl">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* SECTION 1: BASIC INFO */}
              <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Product Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} className="input-field" placeholder="e.g. Farm Fresh Milk" required />
                    </div>
                    <div>
                        <label className="label">Category</label>
                        <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="input-field" required>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Price (₹)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="input-field" placeholder="0.00" required />
                    </div>
                    <div>
                        <label className="label">Stock Qty</label>
                        <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} className="input-field" placeholder="0" required />
                    </div>
                  </div>

                  <div>
                    <label className="label">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field h-20" placeholder="Product details..."></textarea>
                  </div>

                  <div>
                    <label className="label">Serving_options in (ml/l)</label>
                    <input type="text" name="serving_options" value={formData.serving_options} onChange={handleInputChange} className="input-field" placeholder="0" required />
                </div>
              </div>

              {/* SECTION 2: QUALITY & DETAILS */}
              <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1">Quality & Sourcing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="label">Shelf Life</label>
                          <input name="shelf_life" value={formData.shelf_life} onChange={handleInputChange} className="input-field" placeholder="e.g. 3 Days" />
                      </div>
                      <div>
                          <label className="label">Sourcing Origin</label>
                          <input name="sourcing_origin" value={formData.sourcing_origin} onChange={handleInputChange} className="input-field" placeholder="e.g. Local Farms, Pune" />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label className="label">Allergen Info</label>
                          <input name="allergen_info" value={formData.allergen_info} onChange={handleInputChange} className="input-field" placeholder="e.g. Contains Lactose" />
                      </div>
                      <div>
                          <label className="label">Best Suited For (comma separated)</label>
                          <input name="best_suited_for" value={formData.best_suited_for} onChange={handleInputChange} className="input-field" placeholder="e.g. Tea, Coffee, Curd" />
                      </div>
                  </div>

                  <div>
                      <label className="label">Storage Tips</label>
                      <textarea name="storage_tips" value={formData.storage_tips} onChange={handleInputChange} className="input-field h-16" placeholder="e.g. Keep refrigerated at 4°C"></textarea>
                  </div>
              </div>

              {/* SECTION 3: IMAGES */}
              <div className="space-y-4 border-t pt-4">
                <div>
                    <label className="label mb-2 block">Main Image (Required)</label>
                    <input type="file" onChange={(e) => setMainImage(e.target.files[0])} className="file-input" required />
                </div>
                <div>
                    <label className="label mb-2 block">Gallery Images (Max 5)</label>
                    <input type="file" multiple accept="image/*" onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 5) {
                                alert("Maximum 5 gallery images allowed!");
                                e.target.value = "";
                                setGallery([]);
                            } else {
                                setGallery(files);
                            }
                        }} 
                        className="file-input" 
                    />
                </div>
              </div>

              {/* SUBMIT */}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary">
                    {loading ? (<div role="status">
                        <svg aria-hidden="true" class="inline w-8 h-8 text-neutral-tertiary animate-spin fill-success" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>) : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PRODUCT TABLE --- */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
                <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                    <React.Fragment key={p.id}>
                        {/* MAIN ROW */}
                        <tr 
                            onClick={() => setExpandedProductId(expandedProductId === p.id ? null : p.id)} 
                            className={`max-[650px]:text-sm cursor-pointer transition hover:bg-gray-50 ${expandedProductId === p.id ? 'bg-blue-50/50' : ''}`}
                        >
                            <td className="p-4 flex items-center gap-3">
                                <img src={p.image_url} alt="" className="w-10 h-10 rounded object-cover border bg-white" />
                                <div>
                                    <span className="font-medium text-gray-800 block">{p.name}</span>
                                    <span className="max-[650px]:hidden transition-all text-xs text-gray-400">Click to view details</span>
                                </div>
                            </td>
                            <td className="max-[650px]:pr-2 p-4 text-gray-600">{p.category_name || 'N/A'}</td>
                            <td className="p-4 font-semibold text-gray-700">₹{p.price}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock_quantity < 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {p.stock_quantity} <span className='max-[650px]:hidden'>in stock</span>
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <button onClick={(e) => handleDelete(p.id, e)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition" title="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>

                        {/* EXPANDED DETAILS ROW */}
                        {expandedProductId === p.id && (
                            <tr className="bg-gray-50 animate-fade-in">
                                <td colSpan="5" className="p-6 border-t border-gray-100 shadow-inner">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        
                                        {/* Col 1: Description & Quality */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Description</h4>
                                                <p className="text-gray-700 text-sm whitespace-pre-line">{p.description || "No description provided."}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded border border-gray-100">
                                                <div>
                                                    <h5 className="text-xs font-bold text-gray-400 uppercase">Shelf Life</h5>
                                                    <p className="text-sm font-medium text-gray-700">{p.shelf_life || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <h5 className="text-xs font-bold text-gray-400 uppercase">Origin</h5>
                                                    <p className="text-sm font-medium text-gray-700">{p.sourcing_origin || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <h5 className="text-xs font-bold text-gray-400 uppercase">Storage</h5>
                                                    <p className="text-sm font-medium text-gray-700">{p.storage_tips || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <h5 className="text-xs font-bold text-gray-400 uppercase">Allergens</h5>
                                                    <p className="text-sm font-medium text-red-500">{p.allergen_info || 'None'}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <h5 className="text-xs font-bold text-gray-400 uppercase">Best Suited For</h5>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {p.best_suited_for && p.best_suited_for.length > 0 ? (
                                                            p.best_suited_for.map((tag, i) => (
                                                                <span key={i} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded border border-blue-100">{tag}</span>
                                                            ))
                                                        ) : <span className="text-sm text-gray-400">-</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Col 2: Gallery */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Gallery</h4>
                                            {p.gallery && p.gallery.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {p.gallery.map((img, index) => (
                                                        <a key={index} href={img} target="_blank" rel="noopener noreferrer" className="block">
                                                            <img 
                                                                src={img} 
                                                                alt={`Gallery ${index}`} 
                                                                className="w-full h-24 rounded-lg object-cover border border-gray-200 hover:opacity-90 transition" 
                                                            />
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No additional images.</p>
                                            )}
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
      </div>

      <style>{`
        .label { display: block; font-size: 0.8rem; font-weight: 600; color: #4B5563; margin-bottom: 0.25rem; }
        .input-field { width: 100%; padding: 0.5rem; border: 1px solid #E5E7EB; border-radius: 0.375rem; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: #10B981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1); }
        .file-input { display: block; width: 100%; font-size: 0.85rem; color: #6B7280; }
        .btn-primary { background-color: #10B981; color: white; padding: 0.6rem; border-radius: 0.375rem; font-weight: 500; font-size: 0.9rem; transition: all 0.2s; }
        .btn-primary:hover { background-color: #059669; }
        .btn-secondary { border: 1px solid #D1D5DB; color: #374151; padding: 0.6rem; border-radius: 0.375rem; font-size: 0.9rem; transition: background-color 0.2s; }
        .btn-secondary:hover { background-color: #F9FAFB; }
      `}</style>
    </div>
  );
};

export default ProductManager;