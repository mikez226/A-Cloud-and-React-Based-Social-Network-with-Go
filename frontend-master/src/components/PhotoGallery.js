import React from 'react';
import PropTypes from "prop-types";

import Gallery from "react-grid-gallery";

function PhotoGallery(props) {
  const { images } = props;
  const imageArray = images.map( image => {
    return {
      ...image,
      customOverlay: (
        <div className="gallery-caption">
          <div>
            {`${image.user}: ${image.caption}`}
          </div>
        </div>
      )
    }
  })

  return (
    <div className="gallery-wrapper">
      <Gallery
        images={imageArray}
        enableImageSelection={false}
        backdropClosesModal={true}
      />
    </div>
  );

  PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        thumbnailWidth: PropTypes.number.isRequired,
        thumbnailHeight: PropTypes.number.isRequired
      })
    ).isRequired
  };
}

export default PhotoGallery;
