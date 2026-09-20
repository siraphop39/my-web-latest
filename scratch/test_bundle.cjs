try {
    const fs = require('fs');
    console.log("Reading manifest...");
    const manifest = JSON.parse(fs.readFileSync('./public/build/manifest.json'));
    console.log("App file:", manifest['resources/js/app.jsx'].file);
} catch (e) {
    console.error("Error:", e);
}
