import Carousel from './Carousel'
import ExploreCategories from './Chategory'
import NewLaunchesSlider from './Slider'
import GawyamProcess from './Process'
import GawyamReviews from './HomeReviews'
import ShopMore from './ShopMore'

function Home() {

return (
  <div className='flex flex-col justify-center items-center px-6 md:px-6 lg:px-4 py-4 w-full'>
    {/*This is banner*/}
    <Carousel />

    <ExploreCategories />

    <NewLaunchesSlider />

    <GawyamProcess />

    <GawyamReviews />

    <ShopMore />
  </div>
)
}

export default Home