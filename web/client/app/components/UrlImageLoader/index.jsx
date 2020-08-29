// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

// global Image
import React, { Component } from 'react';
import styled from 'styled-components';
import { Image } from 'rebass';
import axios from 'axios';

const defaultStyle = {
  width: '100%',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  height: '100%'
};

const ImageContainer = styled(Image)`
`;

class UrlImageLoader extends Component {

  constructor (props) {
    super(props);
    this.state = {
      newImage: '',
      keyProps: this.props.keyProps
    };
    this.loadImage = this.loadImage.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
  }
  componentDidUpdate (prevProps) {
    if (prevProps.src !== this.props.src && this.props.src) {
      this.loadImage();
    }
  };

  componentDidMount () {
    this.loadImage();
  }

  loadImage () {
    if (this.cancelToken) {
      this.cancelToken.cancel('Operation canceled due to new request.');
    }
    this.cancelToken = axios.CancelToken.source();
    axios.get(`${this.props.src}`,
      { responseType: 'blob', cancelToken: this.cancelToken.token })
      .then((response) => {
        var reader = new window.FileReader();
        reader.readAsDataURL(response.data);
        reader.onload = () => {
          const url = reader.result;
          if (this.imageContainer) {
            this.imageContainer.attrs.src = url;
            this.setState({ newImage: this.props.src });
          }
        };
      });
  }

  handleImageError () {
    if (this.imageContainer && this.imageContainer.attrs) {
      this.imageContainer.attrs.src = '';
    }
  }

  render () {
    return (
      <ImageContainer
        className='image'
        alt=''
        style={this.props.imageStyle || defaultStyle}
        ref={imageLoadedElem => (this.imageContainer = imageLoadedElem)}
        onError={this.handleImageError}
      />
    );
  }

}

export default UrlImageLoader;
