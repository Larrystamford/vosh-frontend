import React, { useState, useRef } from 'react'
import './Explore.css'
import 'swiper/swiper-bundle.css'
import { ImageLoad } from '../components/ImageLoad'
import { ExploreVideo } from './ExploreVideo'
import Dialog from '@material-ui/core/Dialog'
import axios from '../axios'
import { SettingsInputAntenna } from '@material-ui/icons'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import useOnScreen from '../customHooks/useOnScreen'
import { useDidMountEffect } from '../customHooks/useDidMountEffect'

export const ExploreImage = ({
  viewIndex,
  proTheme,
  username,
  userImage,
  imgLink,
  productId,
  proLinkName,
  proLink,
  tiktokVideoLink,
  tiktokEmbedLink,
  tiktokCoverImage,
  linkClickCount,
  size,
  handleScrollViewClose,
  keyIndex,
}) => {
  const [openVideo, setOpenVideo] = useState(false)
  const [animateOpenVideo, setAnimateOpenVideo] = useState(false)
  const [animateWord, setAnimateWord] = useState(false)

  const visibleRef = useRef()
  const isVisible = useOnScreen(visibleRef)

  const handleClickItem = async () => {
    window.open(proLink, '_blank')
    await axios.get('/v1/users/incrementProductClickCount/', {
      params: { username: username, productId: productId },
    })
  }

  const viewCountHelper = (viewCount) => {
    return viewCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  useDidMountEffect(() => {
    if (isVisible) {
      setAnimateOpenVideo(true)
      setTimeout(() => setAnimateWord(true), 800)

      setTimeout(() => {
        setAnimateOpenVideo(false)
        setAnimateWord(false)
      }, 4000)
    }
  }, [isVisible])

  return (
    <div className="explore_page_image_container" key={productId}>
      {keyIndex > 9 ? (
        <>
          <div className="contentDetailsHeaderContainer">
            <div
              className="pro_profile_icon_name"
              style={{
                marginBottom: '15px',
                marginTop: '15px',
                marginLeft: '5px',
              }}
            >
              <img src={userImage} className="explore_header_image_circular" />
              <p style={{ marginLeft: '7px' }}>{username}</p>
            </div>
          </div>
          {tiktokEmbedLink ? (
            <div
              className="exploreImageCover"
              onClick={() => {
                setOpenVideo(true)
              }}
            >
              <ImageLoad
                src={imgLink}
                style={{
                  width: '100%',
                }}
              />
              <div className="exploreImageVideoClick">Watch Video</div>
            </div>
          ) : (
            <div className="exploreImageCover">
              <ImageLoad
                src={imgLink}
                style={{
                  width: '100%',
                }}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="contentDetailsHeaderContainer">
            <div
              className="pro_profile_icon_name"
              style={{
                marginBottom: '15px',
                marginTop: '15px',
                marginLeft: '5px',
              }}
            >
              <img src={userImage} className="explore_header_image_circular" />
              <p style={{ marginLeft: '7px' }}>{username}</p>
            </div>
          </div>
          {tiktokEmbedLink ? (
            <div
              className="exploreImageCover"
              onClick={() => {
                setOpenVideo(true)
              }}
            >
              <img
                src={imgLink}
                style={{
                  width: '100%',
                }}
              />
              <div
                className="exploreImageVideoClick"
                style={
                  animateOpenVideo
                    ? { width: '115px', height: '30px' }
                    : { width: '30px', height: '30px', borderRadius: '20px' }
                }
              >
                {animateOpenVideo ? (
                  <div className="exploreIconAndWords">
                    <PlayArrowIcon
                      style={{ fontSize: '20px', marginLeft: '8px' }}
                    />
                    {animateWord && (
                      <p
                        style={{
                          marginTop: '1px',
                          marginLeft: '3px',
                          textOverflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Watch Video
                      </p>
                    )}
                  </div>
                ) : (
                  <PlayArrowIcon
                    style={{ fontSize: '20px', marginLeft: '5px' }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="exploreImageCover">
              <img
                src={imgLink}
                style={{
                  width: '100%',
                }}
              />
            </div>
          )}
        </>
      )}

      <div className="exploreImageBottomContainer">
        <div className="contentDetailsBottomRow">
          <p>{proLinkName}</p>
        </div>
        <div className="contentDetailsBottomRowMetrics">
          {linkClickCount > 0 && (
            <p>{viewCountHelper(linkClickCount * 11)} views</p>
          )}
        </div>
        <div
          className="contentDetailsBottomButton"
          onClick={handleClickItem}
          ref={visibleRef}
        >
          <p>View on Website</p>
        </div>
      </div>

      <ExploreVideo
        openVideo={openVideo}
        setOpenVideo={setOpenVideo}
        tiktokEmbedLink={tiktokEmbedLink}
      />
    </div>
  )
}
