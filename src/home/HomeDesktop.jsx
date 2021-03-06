import React, { useState } from 'react'
import './Home.css'

import { useHistory } from 'react-router'
import { ImageLoad } from '../components/ImageLoad'

import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

import axios from '../axios'

export const HomeDesktop = ({}) => {
  const history = useHistory()
  return (
    <div className="home_phone_body">
      <div className="home_header">
        <div
          className="pro_profile_icon_and_name"
          onClick={() => {
            history.push('/')
          }}
        >
          <img
            src="https://dciv99su0d7r5.cloudfront.net/whale+black.png"
            style={{ height: '16px' }}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <div
            className="home_header_button"
            style={{ color: 'black', backgroundColor: 'transparent' }}
            onClick={() => {
              history.push('/login')
            }}
          >
            Sign In
          </div>
          <div
            className="home_header_button"
            onClick={() => {
              history.push('/getStarted')
            }}
          >
            Sign Up
          </div>
        </div>
      </div>
      <div className="home_dekstop_blocks" style={{ minHeight: '50rem' }}>
        <div className="home_dekstop_blocks_left">
          <p className="home_desktop_blocks_text">
            Connect all your audiences and shoppable content with a single
            website
          </p>
          <p
            className="home_desktop_blocks_text"
            style={{ fontSize: '23px', marginTop: '1rem' }}
          >
            Import your content from your socials with one click
          </p>
          <p
            className="home_desktop_blocks_text"
            style={{ fontSize: '23px', marginTop: '1rem' }}
          >
            Show your audience what you love with a TikTok video
          </p>
          <p
            className="home_desktop_blocks_text"
            style={{ fontSize: '23px', marginTop: '1rem' }}
          >
            Customise and build your personal brand
          </p>
          <div
            className="home_header_button"
            onClick={() => {
              history.push('/getStarted')
            }}
            style={{ width: '8.5rem', marginTop: '2rem' }}
          >
            Get Started
          </div>
        </div>
        <div
          className="home_dekstop_blocks_right"
          style={{ position: 'relative' }}
        >
          <iframe
            src="/josephxtan"
            height="570"
            width="300"
            title="Iframe Example"
            style={{
              borderRadius: 20,
              border: '6px solid grey',
              marginBottom: '80px',
            }}
          ></iframe>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 0,
            }}
            onClick={() => {
              window.open('/josephxtan', '_self')
            }}
          >
            <img
              src="https://dciv99su0d7r5.cloudfront.net/1623528019984_DE300B0D-53DC-4343-AB33-0976C811291F.jpeg"
              className="pro_profile_top_image_circular"
              style={{
                border: '4px solid white',
                height: '100px',
                width: '100px',
              }}
            />
            <p
              className="home_phone_blocks_smaller_text"
              style={{ marginTop: '0.5rem', fontWeight: 600, color: 'grey' }}
            >
              vosh.club/josephxtan
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

{
  /* <div className="computer_QrWrapper">
  <img
    src="https://dciv99su0d7r5.cloudfront.net/vosh_qr.png"
    alt="qr_code"
    style={{ height: 150 }}
  />
  <p>Scan with mobile</p>
</div>; */
}
