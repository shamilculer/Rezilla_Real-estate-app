import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import {Zoom} from "yet-another-react-lightbox/plugins"
import "yet-another-react-lightbox/styles.css";

const ImageSlider = ({images}) => {

    const [lightboxOpen, setLightboxOpen] = useState(false)

    const handleLightboxOpen = () => {
        setLightboxOpen(true)
    }

    return (
        <>
        <div className='w-full'>
            <div className='w-full flex max-md:flex-col gap-1'>
                <div className='w-full md:w-[70%] max-h-[500px] overflow-hidden rounded-md' >
                    <img className='w-full object-cover rounded-md hover:scale-105 transition-all cursor-pointer' src={images && images[0]} alt="" onClick={handleLightboxOpen} />
                </div>

                <div className='w-full md:w-[30%] flex md:flex-col gap-1 relative'>
                    {images?.slice(1, 4).map((image, index) => (
                        <div key={index} className='max-md:min-h-28 max-h-32 overflow-hidden rounded-md' >
                          <img className='w-full h-full object-cover rounded-md hover:scale-105 transition-all cursor-pointer' src={image} alt="" onClick={handleLightboxOpen} />
                        </div>
                    ))}

                    {images && images.length > 4 ? (
                        <div className='absolute bottom-0 left-0 w-full h-1/3 bg-black bg-opacity-60 cursor-pointer z-1 flex items-center justify-center rounded-md hover:bg-opacity-75 transition px-2' onClick={handleLightboxOpen}>
                            <span className="text-white max-md:text-xs">
                                View {images.length - 4} more images
                            </span>
                        </div>
                    ) : (null)}
                </div>
                </div>
            </div>

                <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={images?.map(image => ({ src: image }))}

                plugins={[Zoom]}
               />
        </>
        
    )
}

export default ImageSlider