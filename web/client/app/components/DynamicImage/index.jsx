// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

// global Image
import React, { Component } from 'react';
import config from 'app.config';
import axios from 'axios';

class DynamicImage extends Component {

  constructor (props) {
    super(props);
    this.fadeInTime = props.fadeInTime || 0.3;
    this.dynamicImageHd = null;
    this.srcPreload = `${config.webPaths.assets}default_image.png`;

    this.dynamicImageContainer = {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#eee'
    };

    this.dynamicImageLoaded = {
      position: 'absolute',
      zIndex: 2,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transition: `opacity ${this.fadeInTime}s ease`,
      opacity: 0,
      height: '100%',
      width: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: this.props.bgSize ? this.props.bgSize : 'contain',
      backgroundPositionY: '50%',
      backgroundPositionX: '50%',
      border: 'solid 1px white',
      boxSizing: 'border-box'
    };
  }

  componentDidMount () {
    if (this.props.src) {
      axios.get(`${this.props.src}`,
        { responseType: 'blob' })
        .then((response) => {
          var reader = new window.FileReader();
          reader.readAsDataURL(response.data);
          /* istanbul ignore next */
          reader.onload = () => {
            const url = reader.result;
            if (this.dynamicImageHd) {
              this.dynamicImageHd.style.backgroundImage = `url('${url}')`;
              this.dynamicImageHd.style.opacity = 1;
              this.dynamicImageLow.style.opacity = 0;
              setTimeout(function () {
                this.dynamicImageLow.style.display = 'none';
              }.bind(this), 1000 * this.fadeInTime);
            }
          };
        });
    }
  };

  render () {
    return (
      <div className='dynamic-image-container' style={this.dynamicImageContainer}>
        <div
          className='dynamic-image'
          style={this.dynamicImageLoaded}
          alt=''
          ref={imageLoadedElem => (this.dynamicImageHd = imageLoadedElem)}
        />
        <div className='default-image' alt='' ref={imageLoadedElem => (this.dynamicImageLow = imageLoadedElem)} style={{
          backgroundImage: `url('${this.srcPreload}')`,
          position: 'absolute',
          zIndex: 1,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 1,
          transition: `opacity ${this.fadeInTime}s ease`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          height: '100%',
          width: '100%',
          border: 'solid 1px #ccc',
          boxSizing: 'border-box'
        }}
        />
      </div>
    );
  }

}

export default DynamicImage;
