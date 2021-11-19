import React, { useState, useRef } from 'react'
import axios from '../../axios'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import clsx from 'clsx'
import { useWindowSize } from '../../customHooks/useWindowSize'
import { makeStyles } from '@material-ui/core/styles'
import PlaylistAddOutlinedIcon from '@material-ui/icons/PlaylistAddOutlined'
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined'
import AddBoxIcon from '@material-ui/icons/AddBox'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'

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
    width: '100%',
  },
  multilineColor: {
    color: 'black',
  },
}))

export const LinkEdit = ({
  openLinkEdit,
  setOpenLinkEdit,
  handleLinkEditClose,
  linksState,
  setlinksState,
  inputValues,
  setInputValues,
  editingIndex,
  shoppingLinkNumber,
  setShoppingLinkNumber,
}) => {
  const [focused, setFocused] = useState(false)
  const size = useWindowSize()
  const classes = useStyles()

  const handleChange = (prop) => (event) => {
    setInputValues({ ...inputValues, [prop]: event.target.value })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // onSubmitSignUp();
    }
  }

  const handleLinkEditSave = async () => {
    if (
      inputValues.proLinkName != '' &&
      inputValues.proLink != '' &&
      inputValues.productImageLink != ''
    ) {
      let haveHttp = true

      if (!inputValues.proLink.toLowerCase().includes('http')) {
        haveHttp = false
      }

      if (
        shoppingLinkNumber == 2 &&
        !inputValues.proLink2.toLowerCase().includes('http')
      ) {
        haveHttp = false
      }

      if (
        shoppingLinkNumber == 3 &&
        !inputValues.proLink3.toLowerCase().includes('http')
      ) {
        haveHttp = false
      }

      if (
        shoppingLinkNumber == 4 &&
        !inputValues.proLink4.toLowerCase().includes('http')
      ) {
        haveHttp = false
      }

      if (
        shoppingLinkNumber == 5 &&
        !inputValues.proLink5.toLowerCase().includes('http')
      ) {
        haveHttp = false
      }

      if (
        inputValues.tiktokVideoLink &&
        !inputValues.tiktokVideoLink.toLowerCase().includes('http')
      ) {
        haveHttp = false
      }

      if (haveHttp) {
        let tiktokEmbedLink, tiktokCoverImage

        if (inputValues.tiktokVideoLink) {
          const redirected = await axios.get('/v1/utils/getRedirectedLink/', {
            params: { webLink: inputValues.tiktokVideoLink },
          })

          const tiktokResponse = await fetch(
            'https://www.tiktok.com/oembed?url=' +
              redirected.data.redirectedLink,
          )
          const tiktokData = await tiktokResponse.json()
          tiktokCoverImage = tiktokData.thumbnail_url
          tiktokEmbedLink =
            'https://www.tiktok.com/embed/' + redirected.data.tiktokVideoId
        }

        if (editingIndex > -1) {
          let prevItems = linksState['items']
          prevItems[editingIndex] = {
            _id: prevItems[editingIndex]._id,
            id: prevItems[editingIndex].id,
            proLink: inputValues.proLink,
            proLink2: inputValues.proLink2,
            proLink3: inputValues.proLink3,
            proLink4: inputValues.proLink4,
            proLink5: inputValues.proLink5,
            proLinkName: inputValues.proLinkName,
            tiktokVideoLink: inputValues.tiktokVideoLink,
            productImageLink: inputValues.productImageLink,
            tiktokCoverImage: tiktokCoverImage,
            tiktokEmbedLink: tiktokEmbedLink,
          }
          setlinksState({ items: prevItems })
          setShoppingLinkNumber(1)
        } else {
          setlinksState((prevState) => ({
            items: [
              {
                id: inputValues.proLink + new Date().getTime(),
                proLink: inputValues.proLink,
                proLink2: inputValues.proLink2,
                proLink3: inputValues.proLink3,
                proLink4: inputValues.proLink4,
                proLink5: inputValues.proLink5,
                proLinkName: inputValues.proLinkName,
                tiktokVideoLink: inputValues.tiktokVideoLink,
                productImageLink: inputValues.productImageLink,
                tiktokCoverImage: tiktokCoverImage,
                tiktokEmbedLink: tiktokEmbedLink,
              },
              ...prevState['items'],
            ],
          }))
          setShoppingLinkNumber(1)
        }

        setOpenLinkEdit(false)
      } else {
        alert('Please ensure all links start with HTTPS://')
      }
    } else {
      alert('Please ensure image is uploaded and fields are not empty')
    }
  }

  const hiddenFileInput = useRef(null)
  const handleUploadClick = (event) => {
    hiddenFileInput.current.click()
  }
  const handleFileUpload = async (file) => {
    const mediaType = file.type.split('/')
    if (mediaType && mediaType[0] != 'image') {
      alert('Please upload images only')
    } else if (mediaType) {
      const imageUrl = await getFileUrl(file)

      setInputValues({ ...inputValues, productImageLink: imageUrl })
    }
  }
  const getFileUrl = async (file) => {
    let formData = new FormData()
    formData.append('media', file)

    const result = await axios.post('/v1/upload/aws', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return result.data.url
  }

  return (
    <Dialog open={openLinkEdit}>
      <DialogContent>
        <DialogContentText>
          {editingIndex === -1 ? 'Add New Link' : 'Edit Link'}
        </DialogContentText>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            color: '#3997f0',
            minHeight: '3.5rem',
            fontWeight: 'bold',
          }}
        >
          {inputValues.productImageLink ? (
            <div style={{ position: 'relative' }}>
              <img
                src={inputValues.productImageLink}
                style={{ height: 60, width: 60, borderRadius: '5px' }}
              />
              <ClearOutlinedIcon
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  marginRight: '-7px',
                  marginTop: '-7px',
                  color: 'black',
                  fontSize: '20px',
                }}
                onClick={() => {
                  setInputValues({ ...inputValues, productImageLink: '' })
                }}
              />
            </div>
          ) : (
            <p
              onClick={() => {
                handleUploadClick()
              }}
            >
              Upload Photo
            </p>
          )}
        </div>
        <TextField
          size={size.height < 580 ? 'small' : null}
          label="Title / Name"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          value={inputValues.proLinkName}
          onChange={handleChange('proLinkName')}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: 'white', marginTop: '1rem' }}
        />

        <TextField
          size={size.height < 580 ? 'small' : null}
          label="Product Link"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          value={inputValues.proLink}
          onChange={handleChange('proLink')}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: 'white', marginTop: '1rem' }}
        />

        {(shoppingLinkNumber >= 2 || inputValues.proLink2) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              size={size.height < 580 ? 'small' : null}
              label="Product Link 2"
              id="outlined-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              value={inputValues.proLink2}
              onChange={handleChange('proLink2')}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ backgroundColor: 'white', marginTop: '1rem' }}
            />
            {shoppingLinkNumber == 2 ? (
              <CancelOutlinedIcon
                style={{ color: 'lightgrey' }}
                onClick={() => {
                  setShoppingLinkNumber(1)
                  setInputValues({ ...inputValues, proLink2: '' })
                }}
              />
            ) : (
              <div style={{ width: '1.8rem' }}></div>
            )}
          </div>
        )}

        {(shoppingLinkNumber >= 3 || inputValues.proLink3) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              size={size.height < 580 ? 'small' : null}
              label="Product Link 3"
              id="outlined-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              value={inputValues.proLink3}
              onChange={handleChange('proLink3')}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ backgroundColor: 'white', marginTop: '1rem' }}
            />
            {shoppingLinkNumber == 3 ? (
              <CancelOutlinedIcon
                style={{ color: 'lightgrey' }}
                onClick={() => {
                  setShoppingLinkNumber(2)
                  setInputValues({ ...inputValues, proLink3: '' })
                }}
              />
            ) : (
              <div style={{ width: '1.8rem' }}></div>
            )}
          </div>
        )}

        {(shoppingLinkNumber >= 4 || inputValues.proLink4) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              size={size.height < 580 ? 'small' : null}
              label="Product Link 4"
              id="outlined-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              value={inputValues.proLink4}
              onChange={handleChange('proLink4')}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ backgroundColor: 'white', marginTop: '1rem' }}
            />
            {shoppingLinkNumber == 4 ? (
              <CancelOutlinedIcon
                style={{ color: 'lightgrey' }}
                onClick={() => {
                  setShoppingLinkNumber(3)
                  setInputValues({ ...inputValues, proLink4: '' })
                }}
              />
            ) : (
              <div style={{ width: '1.8rem' }}></div>
            )}
          </div>
        )}

        {(shoppingLinkNumber >= 5 || inputValues.proLink5) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              size={size.height < 580 ? 'small' : null}
              label="Product Link 5"
              id="outlined-start-adornment"
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
              value={inputValues.proLink5}
              onChange={handleChange('proLink5')}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{ backgroundColor: 'white', marginTop: '1rem' }}
            />
            {shoppingLinkNumber == 5 ? (
              <CancelOutlinedIcon
                style={{ color: 'lightgrey' }}
                onClick={() => {
                  setShoppingLinkNumber(4)
                  setInputValues({ ...inputValues, proLink5: '' })
                }}
              />
            ) : (
              <div style={{ width: '1.8rem' }}></div>
            )}
          </div>
        )}

        <TextField
          size={size.height < 580 ? 'small' : null}
          label="TikTok Video Link (Optional)"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          value={inputValues.tiktokVideoLink}
          onChange={handleChange('tiktokVideoLink')}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ backgroundColor: 'white', marginTop: '1rem' }}
        />
        {!inputValues.tiktokVideoLink && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#3997f0',
            }}
          >
            *significantly boost engagement
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleLinkEditClose()
            setShoppingLinkNumber(1)
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button onClick={handleLinkEditSave} color="primary">
          Done
        </Button>
      </DialogActions>

      <input
        ref={hiddenFileInput}
        type="file"
        name="file"
        onChange={(e) => {
          handleFileUpload(e.target.files[0])
        }}
      />
    </Dialog>
  )
}

// enable multiple product link adding
// <div
// style={{
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'center',
// }}
// >
// <TextField
//   size={size.height < 580 ? 'small' : null}
//   label="Product Link"
//   id="outlined-start-adornment"
//   className={clsx(classes.margin, classes.textField)}
//   variant="outlined"
//   value={inputValues.proLink}
//   onChange={handleChange('proLink')}
//   onKeyDown={handleKeyDown}
//   onFocus={() => setFocused(true)}
//   onBlur={() => setFocused(false)}
//   style={{ backgroundColor: 'white', marginTop: '1rem' }}
// />
// <AddBoxIcon
//   style={{ color: '#3997f0' }}
//   onClick={() => {
//     if (shoppingLinkNumber < 5) {
//       setShoppingLinkNumber(shoppingLinkNumber + 1)
//     } else {
//       alert('maximum 5 product links')
//     }
//   }}
// />
// </div>
