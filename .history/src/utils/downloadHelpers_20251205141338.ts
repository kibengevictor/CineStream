// Download utility functions for legal content downloads

export const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCSV = (data: string, filename: string) => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Image download failed:', error);
    throw error;
  }
};

export const convertToCSV = (data: any[]): string => {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item).map(val => 
      typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    ).join(',')
  );
  
  return [headers, ...rows].join('\n');
};

export const generateMovieInfoHTML = (movie: any): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${movie.title} - Information</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      padding: 40px; 
      max-width: 800px; 
      margin: 0 auto; 
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { 
      color: #e50914; 
      border-bottom: 3px solid #e50914;
      padding-bottom: 10px;
    }
    .info-section { 
      margin: 20px 0; 
      padding: 15px;
      background: #f9f9f9;
      border-left: 4px solid #e50914;
    }
    .label { 
      font-weight: bold; 
      color: #333; 
      margin-bottom: 5px;
    }
    .rating {
      display: inline-block;
      background: #e50914;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${movie.title}</h1>
    
    <div class="info-section">
      <p class="label">Rating:</p>
      <p><span class="rating">⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}/10</span></p>
    </div>
    
    <div class="info-section">
      <p class="label">Overview:</p>
      <p>${movie.overview || 'No overview available'}</p>
    </div>
    
    <div class="info-section">
      <p class="label">Release Date:</p>
      <p>${movie.release_date || movie.first_air_date || 'N/A'}</p>
    </div>
    
    <div class="info-section">
      <p class="label">Type:</p>
      <p>${movie.type === 'tv' ? 'TV Show' : 'Movie'}</p>
    </div>
    
    <div class="info-section">
      <p class="label">Language:</p>
      <p>${movie.original_language?.toUpperCase() || 'N/A'}</p>
    </div>
    
    <div class="footer">
      <p>Downloaded from CineStream - ${new Date().toLocaleDateString()}</p>
      <p>This is metadata only. No copyrighted video content included.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

export const downloadHTMLFile = (html: string, filename: string) => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
