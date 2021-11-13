import React from 'react'
import { ExplorePage } from './ExplorePage'
import './Explore.css'

import { useHistory } from 'react-router'

import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

export const ExploreScroll = ({
  viewIndex,
  allProductLinks,
  scrollView,
  handleScrollViewClose,
  proTheme,
}) => {
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
      <div className="ExploreHeader">collection</div>

      <ExplorePage
        viewIndex={viewIndex}
        allProductLinks={allProductLinks}
        scrollView={scrollView}
        handleScrollViewClose={handleScrollViewClose}
        proTheme={proTheme}
      />
    </Dialog>
  )
}
