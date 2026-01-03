// components/MomentumXOriginalLogo.jsx
// FIXED - Added "use client" for Next.js App Router

"use client";

import React from 'react';

const MomentumXOriginalLogo = ({ 
  size = 'default', 
  showTagline = true 
}) => {
  return (
    <>
      <div className="momentumx-logo-container">
        <div className="momentumx-shine-overlay"></div>
        
        <div className="momentumx-main-logo">
          <div className="momentumx-icon">
            <div className="momentumx-icon-circle">
              <div className="momentumx-icon-letter">M</div>
            </div>
          </div>

          <h1 className="momentumx-text">
            Momentum<span className="momentumx-x-accent">X</span>
          </h1>
          
          {showTagline && (
            <p className="momentumx-tagline">Build • Connect • Grow</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .momentumx-logo-container {
          background: #000000;
          border-radius: 20px;
          padding: 40px 30px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: inline-block;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .momentumx-main-logo {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .momentumx-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .momentumx-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00e1ff 0%, #00ff9d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 0 20px rgba(0, 225, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          position: relative;
          transition: all 0.3s ease;
        }

        .momentumx-icon-circle::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 6px;
          right: 6px;
          bottom: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
          opacity: 0.6;
        }

        .momentumx-icon-letter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #000;
          z-index: 1;
          position: relative;
        }

        .momentumx-text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #00e1ff 0%, #00ff9d 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
          letter-spacing: -2px;
          text-shadow: none;
        }

        .momentumx-text::before {
          content: 'MomentumX';
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .momentumx-shine-overlay {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.2) 30%, 
            rgba(255, 255, 255, 0.4) 50%, 
            rgba(255, 255, 255, 0.2) 70%, 
            transparent 100%);
          pointer-events: none;
          z-index: 3;
          transition: left 0.8s ease;
        }

        .momentumx-x-accent {
          background: linear-gradient(135deg, #00e1ff 0%, #00ff9d 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .momentumx-tagline {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          margin: 15px 0 0;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* HOVER ANIMATIONS - Only trigger on hover */
        .momentumx-logo-container:hover .momentumx-shine-overlay {
          left: 100%;
        }

        .momentumx-logo-container:hover .momentumx-text::before {
          opacity: 1;
          animation: momentumx-text-shine 1s ease-in-out;
        }

        .momentumx-logo-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .momentumx-logo-container:hover .momentumx-icon-circle {
          transform: scale(1.05);
          box-shadow: 
            0 0 30px rgba(0, 225, 255, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        @keyframes momentumx-text-shine {
          0% { 
            opacity: 0;
            transform: translateX(-20px);
          }
          50% { 
            opacity: 1;
            transform: translateX(0);
          }
          100% { 
            opacity: 0;
            transform: translateX(20px);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .momentumx-text { 
            font-size: 24px; 
            letter-spacing: -1px; 
          }
          .momentumx-logo-container { 
            padding: 30px 20px; 
          }
        }
      `}</style>
    </>
  );
};

export default MomentumXOriginalLogo;