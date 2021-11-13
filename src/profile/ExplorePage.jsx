import React, { useState } from 'react'
import './Explore.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import useDeviceDetect from '../customHooks/useDeviceDetect'
import { useWindowSize } from '../customHooks/useWindowSize'
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined'
import WhatshotOutlinedIcon from '@material-ui/icons/WhatshotOutlined'
import { ImageLoad } from '../components/ImageLoad'
import ExploreOutlined from '@material-ui/icons/ExploreOutlined'
import { ExploreVideo } from './ExploreVideo'
import { ExploreImage } from './ExploreImage'

export const ExplorePage = ({
  viewIndex,
  allProductLinks,
  scrollView,
  handleScrollViewClose,
  proTheme,
}) => {
  const { isMobile } = useDeviceDetect()
  const size = useWindowSize()
  const [showSocialSelections, setShowSocialSelections] = useState([
    ['allProductLinks', 'all_read'],
    ['tiktok', 'all'],
  ])
  const [showSocial, setShowSocial] = useState('allProductLinks')
  const getSimilarSocialColor = (color) => {
    if (color == 'white') {
      return 'grey'
    } else if (color == 'black') {
      return '#f2f2f2'
    }
  }
  return (
    <div className="ExplorePage">
      <ExploreImage />
      <ExploreVideo />
      <ExploreVideo />
      <ExploreVideo />

      {/* background image */}
      {/* {!isMobile &&
      (size.width > 1100 || size.width == 640) ? null : proTheme.background3 &&
        proTheme.background3.videoUrl &&
        proTheme.background3.imageUrl ? (
        <video
          src={proTheme.background3.videoUrl}
          poster={proTheme.background3.imageUrl}
          playsInline
          autoPlay
          muted
          loop
          id="backgroundVideo"
        />
      ) : (
        <img id="backgroundImage" src={proTheme.background1} />
      )} */}
    </div>
  )
}
