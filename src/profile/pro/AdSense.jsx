import React, { useEffect, useState } from 'react'
import './ProEdit.css'

import axios from '../../axios'
import { useHistory } from 'react-router'

import { SimpleBottomNotification } from '../../components/SimpleBottomNotification'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: '95%',
  },
  multilineColor: {
    color: 'black',
  },
}))

export const AdSense = () => {
  const history = useHistory()
  const classes = useStyles()

  const [caption, setCaption] = useState('')
  const [focused, setFocused] = useState(false)
  const [showNotif, setShowNotif] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('USER_ID')
    if (userId) {
      axios.get('/v1/users/getPro/' + userId).then((response) => {
        const data = response.data.user[0]
        if (data.profileBio) {
          setCaption(data.profileBio)
        }
      })
    }
  }, [])

  // MANUAL SIGN UP
  return (
    <div className="SlidingEdit_Body">
      <div className="SlidingEdit_Header">
        <ArrowBackIosOutlinedIcon
          onClick={() => history.goBack()}
          style={{ paddingLeft: 14 }}
        />
        <span
          style={{
            fontSize: 14,
            position: 'absolute',
            fontWeight: 700,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          AdSense
        </span>
      </div>
      <div>coming soon</div>
    </div>
  )
}
