import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    // 이미 script가 추가되어 있으면 다시 추가하지 않도록 방지
    if (document.getElementById('kakao-map-script')) {
      window.kakao.maps.load(() => {
        createMap();
      });
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=7826b36287d6390f0af227a8e108910a&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        createMap();
      });
    };

    document.head.appendChild(script);

    function createMap() {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.49899194925545, 127.03285492011584),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      const markerPosition = new window.kakao.maps.LatLng(37.49899194925545, 127.03285492011584);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    }
  }, []);

  return <div id="map" style={{ width: '500px', height: '400px' }}></div>;
};

export default KakaoMap;
