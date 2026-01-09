import { useEffect, useState } from 'react'
import { Key, Star, User } from 'react-feather'
import { toast } from 'react-toastify'
import { useAuth } from '../context/authContext'
import { useProf } from '../context/profileContext'

const StarRating = ({totalStars= 5 , onRatingSelect , alone = false}) => {
    const [rating , setRating] = useState(0)
    const [hover , setHover] = useState(0)

    return(
        <div style={{ display: 'flex', gap: '5px' }}>
            {[...Array(totalStars)].map((_ , index) => {
                const starVal = index + 1
                const isActive = starVal <= (hover || rating);

                if (alone){
                    return (
                        <Star 
                        key={starVal}
                        size={20}
                        color='#FFD700'
                        fill='#FFD700'
                        style={{ cursor: 'pointer', transition: '0.1s' }}
                        />
                    )
                }

                return(
                    <Star 
                    key={starVal}
                    size={20}
                    color={isActive ? "#FFD700" : "#ccc"}
                    fill={isActive ? "#FFD700" : "none"}
                    style={{ cursor: 'pointer', transition: '0.1s' }}
                    onMouseEnter={() => setHover(starVal)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => {
                        setRating(starVal)
                        onRatingSelect(starVal)
                        console.log(starVal)
                    }}/>
                )
            })}
        </div>
    )
}

export const Review = ({itemId}) => {
    const [rating , setRating] = useState(null)
    const [comment , setComment] = useState(null)
    const { user} = useAuth()
    const { reviewsGet , reviews , setReviews , reviewPost} = useProf()
    
    const handleCommentSubmit = async () => {
        if(!itemId){
            toast.error('Invalid Item to add review')
            return
        }

        if (!rating && !comment){
            toast.error('Please Enter any comment or rating.')
            return
        }
        
        const savedRating = rating
        const savedComment = comment
        const isVerifiedPurchase = false
        const randId = Date.now();

        const optimisticReview = {
            id: randId,
            rating: rating,
            comment: comment,
            is_verified_purchase: isVerifiedPurchase
        }

        setReviews((prev) => [ optimisticReview , ...prev ])

        setComment("")
        setRating(0)

        try {
            const result = await reviewPost(itemId , savedRating , savedComment, isVerifiedPurchase)
        
            if (result && result.success){
                setReviews(prev => prev.map(r => r.id === randId ? {...result.user_reviews} : r))
            }else {
                toast.error('Error in Saving review')
            }
        } catch (error) {
            setReviews(prev => prev.filter(r => r.id !== randId));

            setComment(savedComment)
            setRating(savedRating)

            toast.error(error.message)
        }
    }

    useEffect(()=>{
        const fetchReviews = async() => {
            try {
                const response = await reviewsGet(itemId)

                toast.success(response.text)
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

        fetchReviews()
    },[])

    return (
        <div className='w-full pt-16 flex flex-col'>
            {user ? 
            <div>
                <div className='text-2xl max-[425px]:text-base font-bold'>
                    Comment Your Review :-
                </div>
                <div className='pt-6 pb-4 flex flex-col'>
                    <StarRating onRatingSelect={(val) => setRating(val)}/>

                    <div className='relative group mt-8'>
                        <textarea 
                        type='text'
                        placeholder=' '
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className='peer w-full min-h-24 p-3 outline-none border focus:border-green-400 bg-neutral-100 rounded-lg transition-all'
                        />

                        <label className='max-[425px]:text-sm absolute left-2 top-2 text-gray-400 pointer-events-none transition-all peer-focus:-top-6 peer-focus:-left-0 peer-focus:text-xs peer-focus:text-green-600 peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:-left-0 peer-[:not(:placeholder-shown)]:text-xs'>
                            Comment your review
                        </label>
                    </div>
                </div>
                <div className=''>
                    <button
                    type="submit"
                    onClick={handleCommentSubmit}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white max-[425px]:text-sm font-bold rounded-lg shadow-md transition-all active:scale-95"
                    >
                    Continue
                    </button>
                </div>
            </div>
            :
            <div></div>}

            <div className='mt-12'>
                
                {reviews && reviews.length === 0 ? (
                    <div className='w-full flex justify-center text-2xl text-neutral-300 font-bold max-[425px]:text-base'>
                        No Reviews to show. Be the first to review!
                    </div>
                ) : (
                    <div>
                        <h3 className='text-xl font-bold mb-4'>Recent Reviews</h3>
                        <div className='flex flex-col gap-4'>
                            {reviews && reviews.map((rev) => (
                                <div onClick={console.log(reviews)} key={rev.comment} className='flex flex-row items-center'>
                                    <div className='p-3 rounded-full bg-neutral-100'>
                                        <User />
                                    </div>

                                    <div key={rev.id} className={`p-4 ${rev.isPending ? 'opacity-50' : 'opacity-100'}`}>
                                        
                                        <div className='font-bold text-green-700'><StarRating totalStars={rev.rating} alone={true}/></div>
                                        <p className='text-neutral-600 mt-2'>{rev.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
    }
