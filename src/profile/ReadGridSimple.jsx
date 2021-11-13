import React, { useEffect } from 'react'
import { useDidMountEffect } from '../customHooks/useDidMountEffect'

import { ImageLoad } from '../components/ImageLoad'

import './VideoGrid.css'
import { useHistory } from 'react-router'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import ShopIcon from '@material-ui/icons/Shop'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const ReadGrid = ({
  allProductLinks,
  size,
  proTheme,
  showReadProducts,
  setShowReadProducts,
  scrolledBottomCount,
  handleScrollViewOpen,
}) => {
  const history = useHistory()

  useEffect(() => {
    setShowReadProducts(allProductLinks.slice(0, 15))
  }, [])

  const getHistoryFeed = (scrolledBottomCount) => {
    setShowReadProducts((prevState) => [
      ...prevState,
      ...allProductLinks.slice(
        scrolledBottomCount * 15,
        scrolledBottomCount * 15 + 15,
      ),
    ])
  }

  useDidMountEffect(() => {
    if (scrolledBottomCount != 0) {
      getHistoryFeed(scrolledBottomCount)
    }
  }, [scrolledBottomCount])

  return (
    <div className="profile_bottom_container" style={{ marginTop: '2px' }}>
      {showReadProducts.map((eachProductLink, i) => {
        if (eachProductLink.itemImage) {
          return (
            <div
              className="pro_profile_top_link_div"
              onClick={() => handleScrollViewOpen(i)}
              style={{
                backgroundColor: proTheme.linkBoxColor,
                width: '90%',
                position: 'relative',
              }}
            >
              <h4 style={{ color: proTheme.linkWordsColor }}>
                {eachProductLink.itemLinkName}
              </h4>

              <ImageLoad
                src={eachProductLink.itemImage}
                style={{
                  height: '35px',
                  width: '35px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  position: 'absolute',
                  left: '8%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          )
        } else {
          return (
            <div
              className="pro_profile_top_link_div"
              onClick={() => handleScrollViewOpen(i)}
              style={{
                backgroundColor: proTheme.linkBoxColor,
                width: '90%',
                position: 'relative',
              }}
            >
              <h4 style={{ color: proTheme.linkWordsColor }}>
                {eachProductLink.itemLinkName}
              </h4>
            </div>
          )
        }
      })}

      <div
        className="pro_profile_icon_and_name profile_bottom_container_logo"
        onClick={() => {
          history.push('/getStarted')
        }}
      >
        <p style={{ color: 'white', fontSize: '14px' }}>Vosh</p>
        <img
          src="https://dciv99su0d7r5.cloudfront.net/ShopLocoLoco+Small+Symbol+White.png"
          style={{ height: '16px' }}
        />
      </div>
    </div>
  )
}
