import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import { app } from '../firebase'

const CreateListing = () => {

    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)

    console.log(formData);

    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
               promises.push(storeImage(files[i]))
                
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)})
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError('image upload failed (2mb per image)')
                setUploading(false)
            })

        } else{
            setImageUploadError('You Only Upload Six image per listing  ')
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log(progress);
                },
                (error) => {
                    reject(error)
                },
                () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl)
                    })
                }

            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((url, i) => i !== index)
        })
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Lisiting</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className="flex flex-col gap-4 flex-1">
                <input type="text" placeholder='name' className='border p-3 rounded-lg' id='name' maxLength={"62"} minLength={"10"} required/>
                <textarea type="text" placeholder='description' className='border p-3 rounded-lg resize-none' id='description' required/>
                <input type="text" placeholder='address' className='border p-3 rounded-lg' id='address' required/>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale"  className='w-5'/>
                        <span>Sell</span>
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" id="rent"  className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parkingSpot"  className='w-5'/>
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished"  className='w-5'/>
                        <span>Furnished</span>
                    </div>
                     <div className="flex gap-2">
                        <input type="checkbox" id="offer"  className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input 
                        type="number" 
                        id="bedroom" 
                        min={'1'} 
                        max={'10'}
                        className="p-3 border-gray-300 rounded-lg" 
                        defaultValue={1}
                        required
                        />
                        <span>Beds</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <input 
                        type="number" 
                        id="bathroom" 
                        min={'1'} 
                        max={'10'}
                        className="p-3 border-gray-300 rounded-lg" 
                        defaultValue={1}
                        required
                        />
                        <span>Baths</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <input 
                        type="number" 
                        id="regularPrice" 
                        min={'1'} 
                        max={'10'}
                        className="p-3 border-gray-300 rounded-lg" 
                        required
                        />
                        <div className="flex flex-col items-center">
                            <span>Regular Price</span>
                            <span className='text-sm'>($ / month)</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input 
                        type="number" 
                        id="discountPrice" 
                        min={'1'} 
                        max={'10'}
                        className="p-3 border-gray-300 rounded-lg" 
                        required
                        />
                        <div className="flex flex-col items-center">
                            <span>Discount Price</span>
                            <span className='text-sm'>($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className='font-semibold'>Images: 
                <span className='font-normal text-gray-600 ml-2'>first image will be the cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input 
                    type="file" 
                    id="images" 
                    accept='image/*' 
                    multiple
                    className='p-3 border border-gray-300 rounded w-full'
                    onChange={(e) => setFiles(e.target.files)}
                    />
                    <button type='button' onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
                </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => {
                            return <div className="flex items-center justify-between p-3 border" key={url}>
                                <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                                <button onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg hover:opacity-75 uppercase' type='button'>Delete</button>
                            </div> 
                        })
                    }
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-70'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing