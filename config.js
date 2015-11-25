module.exports = {
  db: {
    url: 'mongodb://'+process.env.MONGOLAB_USERNAME+':'+process.env.MONGOLAB_PASSWORD+'@ds053784.mongolab.com:53784/ballernyc'
  },
  server: {
    baseUrl: '/api',
    port: 8080
  },
  seed: {
    dataUrl: 'http://www.nycgovparks.org/bigapps/DPR_Basketball_001.xml',
    dataType: 'xml'
  },
  geocode: {
    url: 'https://maps.googleapis.com/maps/api/geocode/json?key='+process.env.GOOGLE_GEOCODE_KEY
  }
}
