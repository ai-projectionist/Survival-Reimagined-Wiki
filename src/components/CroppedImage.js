import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AtlasContext } from '../context';
import { ATLAS_IMAGE_BASE_PATH } from '../config/atlasConfig';

import './CroppedImage.css';

const CroppedImage = ({ atlasName, displayName, tooltipContent }) => {
    const { inventoryAtlas } = useContext(AtlasContext);
    const atlasEntry = inventoryAtlas[atlasName];
    const [isHovering, setIsHovering] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 63, height: 63 });
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const tooltipTarget = useRef(null);

    useEffect(() => {
        tooltipTarget.current = document.getElementById('tooltip-root');
    }, []);

    useEffect(() => {
        if (!atlasEntry) return;

        const img = new Image();
        const u1 = atlasEntry.u1;
        const u2 = atlasEntry.u2;
        const v1 = atlasEntry.v1;
        const v2 = atlasEntry.v2;
        const pngSrc = `${ATLAS_IMAGE_BASE_PATH}${atlasEntry.texture}`;

        const drawImage = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            const sx = u1 * imgWidth;
            const sy = (1 - v2) * imgHeight;
            const sWidth = Math.max(1, (u2 - u1) * imgWidth);
            const sHeight = Math.max(1, (v2 - v1) * imgHeight);

            canvas.width = sWidth;
            canvas.height = sHeight;
            setImageDimensions({ width: sWidth, height: sHeight });

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                sx, sy, sWidth, sHeight,
                0, 0, canvas.width, canvas.height
            );
            setImageLoaded(true);
        };

        img.onload = drawImage;
        img.onerror = () => {
            console.error(`Failed to load image: ${pngSrc}`);
            setImageLoaded(false);
        };
        img.src = process.env.PUBLIC_URL + pngSrc;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [atlasEntry]);

    const handleMouseEnter = (event) => {
        setIsHovering(true);
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({
            top: rect.top + window.scrollY - 10,
            left: rect.left + window.scrollX + (rect.width / 2)
        });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div
            ref={wrapperRef}
            className="cropped-image-wrapper"
            style={{
                width: `${imageDimensions.width}px`,
                height: `${imageDimensions.height}px`
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <canvas
                ref={canvasRef}
                className={`cropped-image-canvas ${imageLoaded ? 'loaded' : ''}`}
            />
            {!imageLoaded && imageDimensions.width > 1 && (
                <div className="loading-placeholder"></div>
            )}
            {isHovering && tooltipTarget.current && createPortal(
                <div className="image-tooltip" style={{
                    top: `${tooltipPosition.top}px`,
                    left: `${tooltipPosition.left}px`,
                }}>
                    {tooltipContent ? tooltipContent : (displayName || 'Name missing?')}
                </div>,
                tooltipTarget.current
            )}
        </div>
    );
};

export default CroppedImage;