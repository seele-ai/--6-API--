document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([30.8459900907317, 120.524761640926], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });
  