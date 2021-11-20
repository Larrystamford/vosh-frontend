import React, { useState } from 'react'
import './Explore.css'
import 'swiper/swiper-bundle.css'
import { ImageLoad } from '../components/ImageLoad'
import { ExploreVideo } from './ExploreVideo'
import Dialog from '@material-ui/core/Dialog'
import axios from '../axios'

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

  const handleClickItem = async () => {
    window.open(proLink, '_blank')
    await axios.get('/v1/users/incrementProductClickCount/', {
      params: { username: username, productId: productId },
    })
  }
  return (
    <div className="explore_page_image_container">
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
              <ImageLoad
                src={userImage}
                className="explore_header_image_circular"
              />
              <p style={{ marginTop: '-5px', marginLeft: '7px' }}>{username}</p>
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
              <p style={{ marginTop: '-5px', marginLeft: '7px' }}>{username}</p>
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
              <div className="exploreImageVideoClick">Watch Video</div>
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
          {linkClickCount > 0 && <p>{linkClickCount * 11} views</p>}
        </div>
        <div className="contentDetailsBottomButton" onClick={handleClickItem}>
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
