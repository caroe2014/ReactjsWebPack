import React from 'react';

const offScreenStyle = {
  whiteSpace: 'nowrap'
};

class Announcements extends React.Component {

  render () {
    return (
      <div role='alert' aria-live={this.props.ariaLive || 'polite'}
        aria-atomic='false'
        style={offScreenStyle}
        className='sr-only'>
        {this.props.message}
      </div>
    );
  }
};
export default Announcements;
