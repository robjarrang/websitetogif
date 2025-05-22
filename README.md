# websitetogif

## Project Description

This project allows users to input any web URL and convert it into a downloadable GIF. Users can set the dimensions for the width of the GIF, and the height will automatically adjust to incorporate the full height of the supplied web page. Users can also set the frame rate and length in time of the resulting GIF. The project uses Bootstrap for UI elements and includes a loading animation.

## Features

- Input any web URL to convert to a GIF
- Set the width of the GIF
- Automatic height adjustment to incorporate the full height of the web page
- Set the frame rate of the GIF
- Set the length in time of the GIF
- Bootstrap for UI elements
- Loading animation

## Usage Instructions

1. Open the application in your browser.
2. Enter the web URL you want to convert to a GIF.
3. Set the desired width for the GIF.
4. Set the desired frame rate for the GIF.
5. Set the desired length in time for the GIF.
6. Click the "Convert" button to start the conversion process.
7. Wait for the loading animation to complete.
8. Download the generated GIF using the provided link.

## Setup Guide

1. Clone the repository:
   ```
   git clone https://github.com/robjarrang/websitetogif.git
   ```
2. Navigate to the project directory:
   ```
   cd websitetogif
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Deploying on Vercel

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
2. Log in to your Vercel account:
   ```
   vercel login
   ```
3. Deploy the project:
   ```
   vercel
   ```

## Dependencies

- Puppeteer
- gifshot
- Bootstrap

## Technologies Used

- Vercel
- Puppeteer
- Bootstrap
- JavaScript
- HTML
- CSS
