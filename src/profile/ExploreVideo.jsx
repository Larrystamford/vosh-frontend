import React, { useState } from 'react'
import './Explore.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { ImageLoad } from '../components/ImageLoad'

export const ExploreVideo = ({
  viewIndex,
  allProductLinks,
  scrollView,
  handleScrollViewClose,
  proTheme,
}) => {
  return (
    <div className="explore_page_video_container">
      <div className="exploreIframeContainer">
        <div className="contentDetailsHeaderContainer">
          <div
            className="pro_profile_icon_name"
            style={{ marginBottom: '3px' }}
          >
            <ImageLoad
              src={
                'https://dciv99su0d7r5.cloudfront.net/1621312433108_3986BD1D-C45F-4F18-A2C3-E505B587EA4D.jpeg'
              }
              className="explore_header_image_circular"
            />
            <p style={{ marginTop: '-5px', marginLeft: '7px' }}>pattywhoa</p>
          </div>
        </div>
        {/* <img
          src="https://dciv99su0d7r5.cloudfront.net/1636549730473_BCEB06E1-157E-4961-86BB-D9BA6B98A48B.jpeg"
          style={{ width: '100%' }}
        /> */}
        <iframe
          height="590"
          width="286"
          title="url"
          src="https://tiktok.com/embed/6955531431846120706"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen=""
        ></iframe>
        <div className="contentDetailsBottomContainer">
          <div className="contentDetailsBottomRow">
            <p>Demon Slayer Tamaguchi</p>
          </div>
          <div className="contentDetailsBottomRowMetrics">
            <p>200 views</p>
          </div>
          <div className="contentDetailsBottomButton">
            <p>View on Website</p>
          </div>
        </div>
      </div>
    </div>
  )
}
