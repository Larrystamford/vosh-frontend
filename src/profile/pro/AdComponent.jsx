import React, { useEffect } from 'react'
import '../Explore.css'

export const AdComponent = () => {
  useEffect(() => {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <div className="explore_page_image_container">
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '100%' }}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-ad-client="ca-pub-6240345912583133"
        data-ad-slot="7049352484"
      ></ins>
    </div>
  )
}
