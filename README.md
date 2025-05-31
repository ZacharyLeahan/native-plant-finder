# 🌿 Native Plant Finder

A React-based web application that helps residents find native plants from nearby nurseries using the Plant Agents Collective API.

## Features

- **Location-based Search**: Search for nurseries by ZIP code with radius or by state abbreviation
- **Interactive Plant Table**: 
  - Sort by any column (scientific name, common name, nursery, state, etc.)
  - Mark plants as favorites with heart icons (❤️)
  - Visual indicators for "All Native" nurseries (🌱)
  - Hover highlights for better readability
- **Export Options**:
  - 📋 Copy favorites list to clipboard (grouped by vendor)
  - 🖨 Export entire table to PDF (landscape format)
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system

### Running the Application

1. Start the application:
```bash
docker compose up -d --build
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. To stop the application:
```bash
docker compose down
```

## How to Use

### Searching for Plants

1. **By ZIP Code**: 
   - Enter a 5-digit ZIP code
   - Select a radius (10, 25, 50, 100, or 200 miles)
   - Click "Search for Plants"

2. **By State**: 
   - Switch to "Search by State" mode
   - Enter a 2-letter state abbreviation (e.g., PA, NY, CA)
   - Click "Search for Plants"

### Managing Favorites

- Click the heart icon (🤍) to add a plant to your favorites
- Favorited plants show a red heart (❤️) and have a light green background
- Sort by favorites to see all your selected plants at the top

### Exporting Your List

- **Copy to Clipboard**: Click "📋 Copy My Plant List" to copy all favorited plants as a formatted text list
- **Export to PDF**: Click "🖨 Export to PDF" to download the entire table as a PDF file

## API Configuration

The application uses the Plant Agents Collective API:
- Base URL: `https://app.plantagents.org`
- Authentication: Bearer token (configured in the application)

## Development

### Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── SearchForm.js      # Location search interface
│   │   ├── PlantTable.js      # Main plant display table
│   │   └── ExportButtons.js   # Export functionality
│   ├── services/
│   │   └── api.js            # API integration
│   ├── App.js                # Main application component
│   └── index.js              # React entry point
├── public/
│   └── index.html            # HTML template
├── docker-compose.yml        # Docker configuration
├── Dockerfile               # Container build instructions
└── package.json            # NPM dependencies
```

### Technologies Used

- React 18
- Axios for API calls
- html2pdf.js for PDF export
- Docker for containerization

## Troubleshooting

- **Application not loading**: Ensure Docker is running and port 3000 is not in use
- **API errors**: Check the browser console for detailed error messages
- **PDF export issues**: Ensure you have a stable internet connection (html2pdf.js loads resources from CDN)

## License

This project uses the Plant Agents Collective API. Please refer to their terms of service for usage guidelines. 