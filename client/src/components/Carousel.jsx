
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const carouselImages = [
{
id:1,
imgUrl:'https://assets-global.website-files.com/619e763bb3de7b56e6107aeb/61f2b135991e87e97b5bfd4c_26-real-estate-questions-Hero-Image.png',
name:'real esate'
},
{
id:2,
imgUrl:'https://thumbs.dreamstime.com/b/real-estate-agent-offer-house-represented-model-wide-banner-composition-bokeh-background-63596018.jpg?w=1600',
name:'real esate1'
},
{
id:3,
imgUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1Bsd7u1lKLwJLhejl68pLP0c6LWWKT45bEw&usqp=CAU',
name:'real esate2'
},
{
id:4,
imgUrl:'https://watermark.lovepik.com/photo/40143/6442.jpg_wh1200.jpg',
name:'real esate3'
},
]

const Carousel = () => {
const [latestData, setLatestData] = useState([])
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true,
        centerPadding: "60px",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "60px",
                },
            },
        ],
    };

useEffect(()=>{
    imagesData()
},[])

const imagesData = async() =>{
    try {
        const urlParamsData = new URLSearchParams(window.location.search)
        urlParamsData.set('housetype','all')
        urlParamsData.set('sort', 'createdAt')
        urlParamsData.set('order','desc')
        const urlSearchQuery = urlParamsData.toString()
        const res = await fetch(`/listing/datas/search?${urlSearchQuery}`)
        const data = await res.json()
        // console.log(data)
        setLatestData(data)
    } catch (error) {
        toast.error(error.message)
    }
}

    return (
        <div className="flex flex-col gap-3 overflow-hidden">
        <div>
            <Slider {...settings}>
                {carouselImages &&
                    carouselImages.length > 0 &&
                    carouselImages.map((data) => {
                        return (
                            <div key={data.id} className="flex justify-center p-2 duration-300 transition-scale hover:scale-95">
                                <img
                                    src={data.imgUrl}
                                    alt={`image ${data.id}`}
                                    className="sm:h-[200px] lg:h-[300px] h-[200px] w-[700px] rounded-md"
                                />
                            </div>
                        );
                    })}
            </Slider>
            <ToastContainer />
            </div>
            <div className="bg-white rounded-md mt-5">
                <div className="mx-auto max-w-2xl lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-semibold text-center pt-2">Latest Estates</h2>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 px-4 py-16">
                    {latestData.map((product) => (
                        <Link to={`/list-data/${product._id}`} key={product._id} className="group border border-slate-400 p-2 rounded-md">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                            <img
                            src={product.images[0]}
                            alt={`${product._id}`}
                            className="h-48 w-full object-cover object-center group-hover:opacity-75"
                            />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700 h-[4.5rem] line-clamp-3">{product.name}</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-500"><span className="font-semibold text-slate-700">RS :</span> {product.regularprice}</p>
                        </Link>
                    ))}
                    </div>
                </div>
                </div>
        </div>
    );
};

export default Carousel;
