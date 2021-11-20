import React, { useState, useEffect } from 'react'
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
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { useDidMountEffect } from '../customHooks/useDidMountEffect'

export const ExplorePage = ({
  viewIndex,
  username,
  userImage,
  proLinks,
  proTheme,
  size,
  handleScrollViewClose,
}) => {
  const [scrolledBottomCount, setScrolledBottomCount] = useState(0)
  const scrollRef = useBottomScrollListener(() => {
    setScrolledBottomCount(scrolledBottomCount + 1)
  })

  const [showReadProducts, setShowReadProducts] = useState([])
  useEffect(() => {
    setShowReadProducts(proLinks.slice(viewIndex, viewIndex + 10))
  }, [])

  const getHistoryFeed = (scrolledBottomCount) => {
    setShowReadProducts((prevState) => [
      ...prevState,
      ...proLinks.slice(
        viewIndex + scrolledBottomCount * 10,
        viewIndex + scrolledBottomCount * 10 + 10,
      ),
    ])
  }

  useDidMountEffect(() => {
    if (scrolledBottomCount != 0) {
      getHistoryFeed(scrolledBottomCount)
    }
  }, [scrolledBottomCount])
  return (
    <div className="ExplorePage" ref={scrollRef}>
      {showReadProducts.map(
        (
          {
            _id,
            id,
            proLink,
            proLink2,
            proLink3,
            proLink4,
            proLink5,
            proLinkName,
            productImageLink,
            tiktokVideoLink,
            tiktokEmbedLink,
            tiktokCoverImage,
            linkClickCount,
          },
          i,
        ) => {
          if (productImageLink) {
            return (
              <ExploreImage
                key={_id}
                username={username}
                userImage={userImage}
                productId={_id}
                proLinkName={proLinkName}
                imgLink={productImageLink}
                proLink={proLink}
                tiktokEmbedLink={tiktokEmbedLink}
                tiktokCoverImage={tiktokCoverImage}
                linkClickCount={linkClickCount}
                keyIndex={i}
              />
            )
          }
        },
      )}
      {/* <ExploreImage
        imgLink={
          'https://media2locoloco-dev.s3.ap-southeast-1.amazonaws.com/1637056737437_2021-11-16%2017.58.35.jpg'
        }
      />
      <ExploreImage
        imgLink={
          'https://dciv99su0d7r5.cloudfront.net/1636549730473_BCEB06E1-157E-4961-86BB-D9BA6B98A48B.jpeg'
        }
      />
      <ExploreImage
        imgLink={
          'https://media2locoloco-dev.s3.ap-southeast-1.amazonaws.com/1637056737437_2021-11-16%2017.58.35.jpg'
        }
      />
      <ExploreImage
        imgLink={
          'https://dciv99su0d7r5.cloudfront.net/1636549730473_BCEB06E1-157E-4961-86BB-D9BA6B98A48B.jpeg'
        }
      /> */}
      <div style={{ marginTop: '3rem', width: '100%' }}></div>
    </div>
  )
}
