const { log } = require("console");

const fetchArtObjects = async (page = 1, size = 10) => {
  const url = `https://api.harvardartmuseums.org/object?apikey=${HARVARD_API_KEY}&page=${page}&size=${size}&hasimage=1`;
  console.log('Fetching from Harvard API:', url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Harvard API error: ${response.statusText}`);
  }

  const data = await response.json();

  const simplified = data.records
    .filter((obj) => obj.primaryimageurl)
    .map((obj) => ({
      _id: obj.id.toString(),       
      title: obj.title || 'Untitled',
      imageUrl: obj.primaryimageurl,
      medium: obj.medium || 'Unknown medium',
      culture: obj.culture || 'Unknown culture',
      period: obj.period || 'Unknown period',
      dimensions: obj.dimensions || 'N/A',
      colors: obj.colors ? obj.colors.map((c) => c.color) : [],
      description: obj.description || '',
    }));

  return simplified;
};




module.exports = { fetchArtObjects };

