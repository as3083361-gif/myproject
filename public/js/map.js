console.log("Token available:", Boolean(mapToken));
console.log("Coordinates:", coordinates);

if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    !coordinates.every(Number.isFinite)
) {
    console.error("Invalid coordinates. Check the listing's saved geometry.");
} else {
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates,
        zoom: 9,
    });

    new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${locationName}</h4>
                 <p>Exact location provided after booking.</p>`))
        .addTo(map);
}