

const ArtObject = require('../models/ArtObject');
const fetch = require('node-fetch');

const HARVARD_API_KEY = process.env.HARVARD_API_KEY;

// 
const fetchArtObjects = async (req, res) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;

  const url = `https://api.harvardartmuseums.org/object?apikey=${HARVARD_API_KEY}&page=${page}&size=${size}&hasimage=1`;

    if (!HARVARD_API_KEY) {
    console.error('❌ HARVARD_API_KEY is missing in .env');
    return res.status(500).json({ msg: 'Missing Harvard API key' });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Harvard API error: ${response.statusText}`);
    }

    const data = await response.json();

    const simplified = data.records
      .filter(obj => obj.primaryimageurl)
      .map(obj => ({
        _id: obj.id.toString(),
        title: obj.title || 'Untitled',
        imageUrl: obj.primaryimageurl,
        medium: obj.medium || 'Unknown medium',
        culture: obj.culture || 'Unknown culture',
        period: obj.period || 'Unknown period',
        dimensions: obj.dimensions || 'N/A',
        description: obj.description || '',
      }));


    return  res.status(200).json(simplified);

  } catch (err) {
    console.error('❌ Error fetching from Harvard API:', err.message);
    res.status(500).json({ msg: 'Failed to fetch art data' });
  }
};

// 
const saveArtObject = async (req, res) => {
  try {
    const owner = req.user.userId; 
    const { title, imageUrl, description, medium, culture, period, dimensions } = req.body;

    const newObject = await ArtObject.create({
      owner,
      title,
      image: imageUrl, //
      description,
      medium,
      culture,
      period,
      dimensions,
    });

      res.status(201).json({
       ...newObject._doc,
      imageUrl: newObject.image,
      });

  } catch (err) {
    console.error('❌ Error saving art object:', err.message);
    res.status(500).json({ msg: 'Failed to save art object' });
  }
};

// 
const getUserCollection = async (req, res) => {
  try {
    const owner = req.user.userId;
    const objects = await ArtObject.find({ owner });

        const formatted = objects.map(obj => ({
      ...obj._doc,
      imageUrl: obj.image,
    }));

    res.status(200).json(objects);
  } catch (err) {
    console.error('❌ Error fetching user collection:', err.message);
    res.status(500).json({ msg: 'Failed to fetch user collection' });
  }
};

// 
const deleteArtObject = async (req, res) => {
  try {
    const owner = req.user.userId;
    const objectId = req.params.id;

    const deleted = await ArtObject.findOneAndDelete({ owner, _id: objectId });
    if (!deleted) return res.status(404).json({ msg: 'Art object not found' });

    res.status(200).json({ msg: 'Art object deleted' });
  } catch (err) {
    console.error('❌ Error deleting art object:', err.message);
    res.status(500).json({ msg: 'Failed to delete art object' });
  }
};

module.exports = {
  fetchArtObjects,
  saveArtObject,
  getUserCollection,
  deleteArtObject,
};


