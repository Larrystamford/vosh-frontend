import React, { useEffect, useState } from 'react'
import './Landing.css'
import { useHistory } from 'react-router'

import axios from '../axios'

export const ProfileDesktop = ({}) => {
  const currentLocation = window.location.pathname
  const history = useHistory()
  const [proTheme, setProTheme] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // load data
  useEffect(() => {
    const windowLocationName = window.location.pathname.slice(1)
    if (windowLocationName === 'profile' || windowLocationName === 'profile/') {
      const userId = localStorage.getItem('USER_ID')
      if (userId) {
        axios.get('/v1/users/getPro/' + userId).then((response) => {
          const data = response.data.user[0]
          setProTheme(data.proTheme)
          setIsLoading(false)
        })
      }
    } else {
      axios
        .get('/v1/users/getByUserNamePro/' + windowLocationName)
        .then((response) => {
          const data = response.data.user[0]
          if (data && data.proTheme) {
            setProTheme(data.proTheme)
          }
          setIsLoading(false)
        })
    }
  }, [])

  return (
    <div className="computer_landing_body">
      <iframe
        src={currentLocation}
        height="100%"
        width="640"
        frameBorder="0"
        allow="fullscreen;"
        allowFullScreen="allowFullScreen"
        mozallowfullscreen="mozallowfullscreen"
        msallowfullscreen="msallowfullscreen"
        oallowfullscreen="oallowfullscreen"
        webkitallowfullscreen="webkitallowfullscreen"
        style={{ border: 0 }}
      ></iframe>

      {proTheme.background3 &&
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
      )}
    </div>
  )
}
