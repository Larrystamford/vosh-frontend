import React, { useState } from 'react'
import './Explore.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { ImageLoad } from '../components/ImageLoad'
import Dialog from '@material-ui/core/Dialog'

export const ExploreVideo = ({ openVideo, setOpenVideo, tiktokEmbedLink }) => {
  const stopVideos = () => {
    document.querySelectorAll('iframe').forEach((v) => {
      v.src = v.src
    })
  }

  return (
    <Dialog
      style={{ zIndex: 10000 }}
      open={openVideo}
      onClose={() => {
        stopVideos()
        setOpenVideo(false)
      }}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <iframe
        style={{ zIndex: 1 }}
        className="exploreIframe"
        title="url"
        src={tiktokEmbedLink}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      <div
        className="exploreVideoBottomContainer"
        onClick={() => {
          stopVideos()
          setOpenVideo(false)
        }}
      >
        <div
          style={{ height: '2.5rem', backgroundColor: 'white', width: '100%' }}
        ></div>
        <div
          className="exploreVideoBottomButton"
          onClick={() => {
            stopVideos()
            setOpenVideo(false)
          }}
        >
          <p>Close</p>
        </div>
      </div>
    </Dialog>
  )
}
