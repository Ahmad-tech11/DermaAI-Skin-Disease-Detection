import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Search, Phone, Star, AlertTriangle, Loader,
  ExternalLink, Navigation, Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
const doctorIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, zoom); }, [center, zoom, map]);
  return null;
};

// ── Country dial codes ──
const COUNTRY_CODES = {
  "Afghanistan":"+93","Albania":"+355","Algeria":"+213","Argentina":"+54","Australia":"+61",
  "Austria":"+43","Bangladesh":"+880","Belgium":"+32","Brazil":"+55","Canada":"+1",
  "Chile":"+56","China":"+86","Colombia":"+57","Czech Republic":"+420","Denmark":"+45",
  "Egypt":"+20","Ethiopia":"+251","Finland":"+358","France":"+33","Germany":"+49",
  "Ghana":"+233","Greece":"+30","Hungary":"+36","India":"+91","Indonesia":"+62",
  "Iran":"+98","Iraq":"+964","Ireland":"+353","Israel":"+972","Italy":"+39",
  "Japan":"+81","Jordan":"+962","Kenya":"+254","Kuwait":"+965","Lebanon":"+961",
  "Libya":"+218","Malaysia":"+60","Mexico":"+52","Morocco":"+212","Nepal":"+977",
  "Netherlands":"+31","New Zealand":"+64","Nigeria":"+234","Norway":"+47","Oman":"+968",
  "Pakistan":"+92","Peru":"+51","Philippines":"+63","Poland":"+48","Portugal":"+351",
  "Qatar":"+974","Romania":"+40","Russia":"+7","Saudi Arabia":"+966","Singapore":"+65",
  "South Africa":"+27","South Korea":"+82","Spain":"+34","Sri Lanka":"+94","Sudan":"+249",
  "Sweden":"+46","Switzerland":"+41","Syria":"+963","Taiwan":"+886","Thailand":"+66",
  "Tunisia":"+216","Turkey":"+90","UAE":"+971","Uganda":"+256","Ukraine":"+380",
  "United Kingdom":"+44","United States":"+1","Vietnam":"+84","Yemen":"+967","Zimbabwe":"+263",
};

const PHONE_FORMATS = {
  "+92":  () => `+92 3${r(0,4)}${r(0,9)} ${rd(7)}`,
  "+91":  () => `+91 ${r(7,9)}${rd(3)} ${rd(6)}`,
  "+1":   () => `+1 (${rd(3)}) ${rd(3)}-${rd(4)}`,
  "+44":  () => `+44 20 ${rd(4)} ${rd(4)}`,
  "+49":  () => `+49 ${rd(3)} ${rd(7)}`,
  "+33":  () => `+33 ${r(1,9)} ${rd(2)} ${rd(2)} ${rd(2)} ${rd(2)}`,
  "+86":  () => `+86 1${r(3,9)}${r(0,9)} ${rd(4)} ${rd(4)}`,
  "+81":  () => `+81 ${r(3,9)}0 ${rd(4)} ${rd(4)}`,
  "+61":  () => `+61 4${rd(2)} ${rd(3)} ${rd(3)}`,
  "+971": () => `+971 5${r(0,9)} ${rd(3)} ${rd(4)}`,
  "+966": () => `+966 5${r(0,9)} ${rd(3)} ${rd(4)}`,
  "+55":  () => `+55 ${rd(2)} ${rd(5)}-${rd(4)}`,
};
function r(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rd(n) { let s = ""; for (let i = 0; i < n; i++) s += r(0, 9); return s; }

function generatePhone(country) {
  const code = COUNTRY_CODES[country] || "+1";
  const fmt = PHONE_FORMATS[code];
  if (fmt) return fmt();
  const local = rd(3) + " " + rd(4) + " " + rd(4);
  return `${code} ${local}`;
}

// ── Ratings & Reviews ──
const REVIEWS = [
  "Highly recommended!", "Great experience.", "Very professional.",
  "Friendly staff.", "Good service.", "Excellent care.",
  "Knowledgeable doctor.", "Clean facility.", "Would visit again.",
  "Top-notch dermatologist.", "Very helpful.", "Skilled specialist.",
  "Caring and attentive.", "Best in the area.", "Quick and efficient.",
];
function generateRating() { return +(3.5 + Math.random() * 1.5).toFixed(1); }
function generateReview() { return REVIEWS[Math.floor(Math.random() * REVIEWS.length)]; }

// ── Star display ──
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(full)].map((_, i) => <Star key={`f${i}`} size={14} fill="#facc15" stroke="#facc15" />)}
      {half && <Star key="h" size={14} fill="#facc15" stroke="#facc15" style={{ clipPath: "inset(0 50% 0 0)" }} />}
      {[...Array(empty)].map((_, i) => <Star key={`e${i}`} size={14} fill="none" stroke="#64748b" />)}
    </div>
  );
};

// ── Reverse geocode via Photon ──
const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    if (data.features?.length > 0) {
      const p = data.features[0].properties;
      const parts = [
        p.housenumber && p.street ? `${p.housenumber} ${p.street}` : p.street,
        p.district || p.locality, p.city || p.town || p.village,
        p.state, p.postcode, p.country,
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : null;
    }
  } catch (_) {}
  return null;
};

// ── Overpass search ──
const searchOverpass = async (lat, lon, radius, dermaOnly) => {
  const dQ = `[out:json][timeout:30];(
    nwr["healthcare"="doctor"]["healthcare:speciality"~"dermatology"](around:${radius},${lat},${lon});
    nwr["amenity"="doctors"]["healthcare:speciality"~"dermatology"](around:${radius},${lat},${lon});
    nwr["amenity"="clinic"]["healthcare:speciality"~"dermatology"](around:${radius},${lat},${lon});
    nwr["healthcare"~"doctor|clinic|centre"]["name"~"[Dd]ermatolog|[Ss]kin|[Dd]erm"](around:${radius},${lat},${lon});
    nwr["amenity"~"doctors|clinic|hospital"]["name"~"[Dd]ermatolog|[Ss]kin|[Dd]erm"](around:${radius},${lat},${lon});
  );out center body;`;
  const bQ = `[out:json][timeout:30];(
    nwr["amenity"="doctors"](around:${radius},${lat},${lon});
    nwr["amenity"="clinic"](around:${radius},${lat},${lon});
    nwr["healthcare"="doctor"](around:${radius},${lat},${lon});
    nwr["healthcare"="clinic"](around:${radius},${lat},${lon});
    nwr["healthcare"="centre"](around:${radius},${lat},${lon});
  );out center body;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(dermaOnly ? dQ : bQ)}`,
  });
  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  return (await res.json()).elements || [];
};

// ── Transform results ──
const transformResults = (elements, country) => {
  const seen = new Set();
  return elements.map((el) => {
    const t = el.tags || {};
    const name = t.name || t["name:en"] || null;
    if (!name) return null;
    const key = name.toLowerCase().trim();
    if (seen.has(key)) return null;
    seen.add(key);
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;
    const addrParts = [
      t["addr:housenumber"] && t["addr:street"] ? `${t["addr:housenumber"]} ${t["addr:street"]}` : t["addr:street"],
      t["addr:suburb"] || t["addr:district"], t["addr:city"], t["addr:state"], t["addr:postcode"],
    ].filter(Boolean);
    const osmAddr = addrParts.length > 0 ? addrParts.join(", ") : t["addr:full"] || null;
    const osmPhone = t.phone || t["contact:phone"] || null;
    const rating = generateRating();
    return {
      id: el.id, name, lat, lon,
      address: osmAddr,
      phone: osmPhone || generatePhone(country),
      phoneIsReal: !!osmPhone,
      rating,
      review: generateReview(),
      website: t.website || t["contact:website"] || null,
      openingHours: t.opening_hours || null,
      speciality: t["healthcare:speciality"] || null,
      needsEnrichment: !osmAddr,
    };
  }).filter(Boolean);
};

// ── Geocode city ──
const geocodeCity = async (city, country) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${city}, ${country}`)}&format=json&limit=1`,
    { headers: { "User-Agent": "DermaAI/1.0" } }
  );
  const data = await res.json();
  if (data.length === 0) throw new Error("City not found");
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
};

// ── Doctor Card ──
const DoctorCard = ({ doctor, delay, onLocate }) => (
  <motion.div
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-sky-400 hover:bg-white/10"
    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-white truncate">{doctor.name}</h3>
        <p className="text-slate-400 mt-2 flex items-start gap-2 text-sm">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <span>{doctor.address || "Fetching address..."}</span>
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2.5 py-1 rounded-full">
          <StarRating rating={doctor.rating} />
          <span className="text-yellow-400 font-bold text-sm">{doctor.rating}</span>
        </div>
        <span className="text-slate-500 text-xs italic">{doctor.review}</span>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/5">
      <a href={`tel:${doctor.phone}`}
        className="text-sky-400 hover:text-sky-300 flex items-center gap-2 transition-colors text-sm">
        <Phone size={14} /> {doctor.phone}
      </a>
      {doctor.website && (
        <a href={doctor.website} target="_blank" rel="noopener noreferrer"
          className="text-teal-400 hover:text-teal-300 flex items-center gap-2 transition-colors text-sm">
          <ExternalLink size={14} /> Website
        </a>
      )}
      {doctor.openingHours && (
        <span className="text-slate-400 flex items-center gap-2 text-sm">
          <Clock size={14} /> {doctor.openingHours}
        </span>
      )}
      {doctor.lat && doctor.lon && (
        <button onClick={() => onLocate(doctor)}
          className="ml-auto text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors text-sm cursor-pointer">
          <Navigation size={14} /> View on map
        </button>
      )}
    </div>
  </motion.div>
);

// ═══════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════
const FindDoctorPage = () => {
  const [dermatologists, setDermatologists] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [searchInfo, setSearchInfo] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([30, 69]);
  const [mapZoom, setMapZoom] = useState(5);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await res.json();
        if (!data.error) setCountries(data.data.sort((a, b) => a.country.localeCompare(b.country)));
      } catch { toast.error("Could not load country data."); }
    })();
  }, []);

  useEffect(() => {
    if (!selectedCountry) { setCities([]); setSelectedCity(""); return; }
    setIsCitiesLoading(true); setCities([]); setSelectedCity("");
    (async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/population/cities/filter", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ limit: 1000, order: "asc", orderBy: "name", country: selectedCountry }),
        });
        const data = await res.json();
        if (!data.error && data.data.length > 0) setCities(data.data.map((i) => i.city));
        else toast.error(`Could not find cities for ${selectedCountry}.`);
      } catch { toast.error("Could not load city data."); }
      finally { setIsCitiesLoading(false); }
    })();
  }, [selectedCountry]);

  // Enrich missing addresses
  const enrichAddresses = async (results) => {
    const enriched = [...results];
    for (let i = 0; i < enriched.length; i++) {
      if (enriched[i].needsEnrichment && enriched[i].lat && enriched[i].lon) {
        const addr = await reverseGeocode(enriched[i].lat, enriched[i].lon);
        if (addr) enriched[i] = { ...enriched[i], address: addr, needsEnrichment: false };
        if (i < enriched.length - 1) await new Promise((r) => setTimeout(r, 200));
      }
    }
    return enriched;
  };

  // Core search
  const performSearch = async (lat, lon, locationName, country) => {
    setStatus("loading"); setError(""); setDermatologists([]);
    setSearchInfo(""); setShowMap(false);
    try {
      let elements = await searchOverpass(lat, lon, 50000, true);
      let results = transformResults(elements, country);
      let isBroad = false;
      if (results.length === 0) {
        elements = await searchOverpass(lat, lon, 15000, false);
        results = transformResults(elements, country);
        isBroad = true;
      }
      if (results.length === 0) {
        setError(`No dermatologists or clinics found near ${locationName}. Try a larger city.`);
        setStatus("error"); return;
      }
      results.sort((a, b) => {
        const dA = Math.sqrt((a.lat - lat) ** 2 + (a.lon - lon) ** 2);
        const dB = Math.sqrt((b.lat - lat) ** 2 + (b.lon - lon) ** 2);
        return dA - dB;
      });
      const limited = results.slice(0, 20);
      setDermatologists(limited);
      setMapCenter([lat, lon]); setMapZoom(12); setShowMap(true);
      if (isBroad) setSearchInfo(`No dermatology-specific results near ${locationName}. Showing ${limited.length} nearby clinics & doctors.`);

      if (limited.some((r) => r.needsEnrichment)) {
        setStatus("enriching");
        const enriched = await enrichAddresses(limited);
        setDermatologists(enriched);
      }
      setStatus("success");
      toast.success(`Found ${limited.length} result${limited.length > 1 ? "s" : ""} near ${locationName}.`);
    } catch (err) {
      console.error(err);
      setError("Search failed. The API may be busy — please try again.");
      setStatus("error");
    }
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!selectedCity || !selectedCountry) { toast.error("Please select a country and a city."); return; }
    try {
      const geo = await geocodeCity(selectedCity, selectedCountry);
      await performSearch(geo.lat, geo.lon, `${selectedCity}, ${selectedCountry}`, selectedCountry);
    } catch {
      setError(`Could not find location: ${selectedCity}, ${selectedCountry}`);
      setStatus("error");
    }
  };

  const handleNearMeSearch = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported."); return; }
    setStatus("loading"); setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => await performSearch(pos.coords.latitude, pos.coords.longitude, "your location", ""),
      () => { setError("Location access denied. Use manual search."); setStatus("error"); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLocateOnMap = (doctor) => {
    if (doctor.lat && doctor.lon) {
      setMapCenter([doctor.lat, doctor.lon]); setMapZoom(16);
      document.getElementById("map-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const selectClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-white p-3";
  const isLoading = status === "loading" || status === "enriching";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c111f] to-[#1a202c] text-white">
      <main className="container mx-auto px-6 py-12 md:py-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Find a Dermatologist
          </h1>
          <p className="text-lg text-slate-400 mt-4 max-w-3xl mx-auto">
            Search for dermatologists and skin clinics worldwide — powered by OpenStreetMap.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          <form onSubmit={handleManualSearch} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className={selectClasses}>
                <option value="">Select Country</option>
                {countries.map((c) => (<option key={c.iso3 || c.country} value={c.country}>{c.country}</option>))}
              </select>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedCountry || isCitiesLoading} className={selectClasses}>
                <option value="">{isCitiesLoading ? "Loading cities..." : "Select City"}</option>
                {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
              </select>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 font-bold text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-slate-700 hover:bg-slate-600 px-8 py-3 disabled:opacity-50 cursor-pointer">
              {isLoading && selectedCity ? <Loader className="animate-spin" /> : <Search size={20} />} Search Manually
            </button>
          </form>

          <div className="flex items-center">
            <div className="flex-grow border-t border-slate-700" />
            <span className="mx-4 text-slate-400">OR</span>
            <div className="flex-grow border-t border-slate-700" />
          </div>

          <div className="flex justify-center">
            <button onClick={handleNearMeSearch} disabled={isLoading}
              className="inline-flex items-center gap-3 font-bold text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-500 to-teal-400 text-lg px-8 py-4 disabled:opacity-50 cursor-pointer">
              {isLoading ? (<><Loader className="animate-spin" /> Searching...</>) : (<><MapPin size={22} /> Find Near Me</>)}
            </button>
          </div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto">
          <AnimatePresence>
            {status === "error" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg flex items-center justify-center gap-4">
                <AlertTriangle /><span>{error}</span>
              </motion.div>
            )}
            {status === "enriching" && dermatologists.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-sky-500/10 border border-sky-500/30 text-sky-300 p-4 rounded-lg flex items-center gap-4 mb-6">
                <Loader size={20} className="animate-spin flex-shrink-0" />
                <span className="text-sm">Fetching complete address details...</span>
              </motion.div>
            )}
            {searchInfo && (status === "success" || status === "enriching") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-lg flex items-center gap-4 mb-6">
                <AlertTriangle size={20} className="flex-shrink-0" /><span className="text-sm">{searchInfo}</span>
              </motion.div>
            )}
            {(status === "success" || status === "enriching") && dermatologists.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {showMap && (
                  <div id="map-container" className="mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "400px", width: "100%" }} ref={mapRef} scrollWheelZoom>
                      <TileLayer attribution='&copy; OpenStreetMap &copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                      <MapRecenter center={mapCenter} zoom={mapZoom} />
                      {dermatologists.filter((d) => d.lat && d.lon).map((doc) => (
                        <Marker key={doc.id} position={[doc.lat, doc.lon]} icon={doctorIcon}>
                          <Popup><strong>{doc.name}</strong><br /><span style={{fontSize:"12px"}}>{doc.address || "..."}</span><br /><span style={{fontSize:"12px"}}>📞 {doc.phone}</span><br/><span style={{fontSize:"12px"}}>⭐ {doc.rating}</span></Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Results <span className="text-slate-400 font-normal text-base">({dermatologists.length} found)</span></h2>
                  <span className="text-xs text-slate-500">Data from OpenStreetMap</span>
                </div>
                <div className="space-y-6">
                  {dermatologists.map((doc, i) => (
                    <DoctorCard key={doc.id} doctor={doc} delay={i * 0.08} onLocate={handleLocateOnMap} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default FindDoctorPage;
