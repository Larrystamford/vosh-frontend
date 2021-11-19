import React from 'react'
import { ExplorePage } from './ExplorePage'
import './Explore.css'

import { useHistory } from 'react-router'

import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

export const ExploreScroll = ({
  viewIndex,
  username,
  userImage,
  proLinks,
  proTheme,
  size,
  scrollView,
  handleScrollViewClose,
}) => {
  const history = useHistory()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      style={{ zIndex: 10000 }}
      open={scrollView}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      fullScreen={fullScreen}
    >
      <div className="ExploreHeader">
        <ArrowBackIosIcon
          style={{ fontSize: '30px', marginLeft: '1rem' }}
          onClick={handleScrollViewClose}
        />
        <p>Explore</p>
        <div style={{ width: '3rem' }}></div>
      </div>

      <ExplorePage
        viewIndex={viewIndex}
        username={username}
        userImage={userImage}
        proLinks={proLinks}
        proTheme={proTheme}
        size={size}
        handleScrollViewClose={handleScrollViewClose}
      />
    </Dialog>
  )
}
