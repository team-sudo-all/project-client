'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Globe, Loader2, Phone, MapIcon, X, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hospitalAPI, Hospital, RecommendHospitalsResponse } from '@/lib/api/hospital';
import { useSymptomStore } from '@/lib/stores/symptomStore';
import { SYMPTOM_CATEGORIES } from '@/constants/symptoms';

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

export default function HospitalsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  
  const { freeText } = useSymptomStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendHospitalsResponse | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error('위치 정보를 가져올 수 없습니다:', err);
          // 기본 위치 (서울 시청)
          setUserLocation({
            latitude: 37.5665,
            longitude: 126.9780,
          });
        }
      );
    } else {
      // Geolocation 미지원 시 기본 위치
      setUserLocation({
        latitude: 37.5665,
        longitude: 126.9780,
      });
    }
  }, []);

  // 병원 추천 API 호출
  useEffect(() => {
    const fetchHospitals = async () => {
      if (!userLocation) return;

      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(storedUser);
      
      // 증상 정보 가져오기
      const storedCategories = sessionStorage.getItem('selectedCategories');
      let symptomsText = freeText || '';
      
      if (storedCategories) {
        const categories = JSON.parse(storedCategories);
        const symptomNames = categories.map((id: string) => {
          const category = SYMPTOM_CATEGORIES.find((c) => c.id === id);
          return category?.label.ko || id;
        });
        symptomsText = symptomNames.join(', ') + (symptomsText ? '. ' + symptomsText : '');
      }

      if (!symptomsText) {
        symptomsText = '일반 진료';
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await hospitalAPI.recommendHospitals({
          user_id: user.user_id,
          symptoms: symptomsText,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: 2000,
        });
        setRecommendations(response);
      } catch (err: any) {
        console.error('병원 추천 실패:', err);
        setError(err.response?.data?.detail || '병원 추천을 가져오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, [userLocation, router, freeText]);

  // 카카오맵 초기화
  useEffect(() => {
    if (!userLocation || !window.kakao) return;

    window.kakao.maps.load(() => {
      const container = document.getElementById('kakao-map');
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude),
        level: 5,
      };

      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;

      // 줌 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 내 위치 마커 (빨간 별)
      const myPosition = new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude);
      const myMarkerImage = new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
        new window.kakao.maps.Size(24, 35)
      );
      const myMarker = new window.kakao.maps.Marker({
        position: myPosition,
        image: myMarkerImage,
        title: '내 위치',
      });
      myMarker.setMap(map);

      setMapLoaded(true);
    });
  }, [userLocation]);

  // 병원 마커 업데이트
  useEffect(() => {
    if (!mapRef.current || !recommendations?.hospitals || !mapLoaded) return;

    const map = mapRef.current;

    // 기존 마커 및 오버레이 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markersRef.current = [];
    overlaysRef.current = [];

    // 새 병원 마커 생성
    recommendations.hospitals.forEach((hospital) => {
      const position = new window.kakao.maps.LatLng(hospital.y, hospital.x);
      
      // 기본 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: position,
        title: hospital.name,
      });
      marker.setMap(map);

      // 병원명 라벨 (CustomOverlay) - 컨테이너와 라벨 분리
      const overlayContainer = document.createElement('div');
      overlayContainer.style.cssText = `
        pointer-events: none;
        display: flex;
        justify-content: center;
      `;
      
      const labelContent = document.createElement('div');
      labelContent.style.cssText = `
        background: white;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 13px;
        font-weight: 600;
        color: #1e40af;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
        pointer-events: auto;
      `;
      labelContent.textContent = hospital.name;
      overlayContainer.appendChild(labelContent);
      
      // 호버 효과 함수
      const applyHoverEffect = () => {
        labelContent.style.backgroundColor = '#dbeafe';
        labelContent.style.transform = 'scale(1.08)';
        labelContent.style.borderColor = '#2563eb';
        labelContent.style.boxShadow = '0 4px 12px rgba(37,99,235,0.4)';
      };
      
      const removeHoverEffect = () => {
        labelContent.style.backgroundColor = 'white';
        labelContent.style.transform = 'scale(1)';
        labelContent.style.borderColor = '#3b82f6';
        labelContent.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      };
      
      // 라벨 호버
      labelContent.addEventListener('mouseenter', applyHoverEffect);
      labelContent.addEventListener('mouseleave', removeHoverEffect);

      // 마커 호버 - 라벨에도 효과 적용
      window.kakao.maps.event.addListener(marker, 'mouseover', applyHoverEffect);
      window.kakao.maps.event.addListener(marker, 'mouseout', removeHoverEffect);

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: overlayContainer,
        yAnchor: -0.1, // 마커 바로 아래
      });
      customOverlay.setMap(map);

      // 클릭 이벤트
      const handleClick = () => {
        setSelectedHospital(hospital);
        map.panTo(position);
      };

      window.kakao.maps.event.addListener(marker, 'click', handleClick);
      labelContent.addEventListener('click', handleClick);

      markersRef.current.push(marker);
      overlaysRef.current.push(customOverlay);
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (recommendations.hospitals.length > 0 && userLocation) {
      const bounds = new window.kakao.maps.LatLngBounds();
      bounds.extend(new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude));
      recommendations.hospitals.forEach((hospital) => {
        bounds.extend(new window.kakao.maps.LatLng(hospital.y, hospital.x));
      });
      map.setBounds(bounds);
    }
  }, [recommendations, mapLoaded, userLocation]);

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (selectedHospital) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedHospital]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedHospital(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // 응급도 색상
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'Emergency':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 응급도 번역
  const getUrgencyLabel = (level: string) => {
    if (i18n.language !== 'ko') return level;
    
    switch (level) {
      case 'Emergency':
        return '응급';
      case 'High':
        return '높음';
      case 'Moderate':
        return '보통';
      case 'Low':
        return '낮음';
      default:
        return level;
    }
  };

  // 진료과 번역
  const translateDepartment = (dept: string) => {
    if (i18n.language === 'ko') return dept;
    
    const translations: { [key: string]: string } = {
      '소화기내과': 'Gastroenterology',
      '정형외과': 'Orthopedics',
      '내과': 'Internal Medicine',
      '외과': 'Surgery',
      '이비인후과': 'ENT',
      '피부과': 'Dermatology',
      '치과': 'Dentistry',
      '안과': 'Ophthalmology',
      '산부인과': 'Obstetrics & Gynecology',
      '소아과': 'Pediatrics',
      '정신건강의학과': 'Psychiatry',
      '비뇨기과': 'Urology',
      '응급의학과': 'Emergency Medicine',
    };
    
    return translations[dept] || dept;
  };

  return (
    <div className="flex h-screen flex-col relative">
      {/* Header */}
      <header className="bg-blue-50 px-6 py-4 z-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/symptoms/chart"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('symptoms.back')}
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <Home className="h-4 w-4" />
              {i18n.language === 'ko' ? '메인' : 'Home'}
            </Link>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === 'ko' ? 'EN' : '한국어'}
          </button>
        </div>
      </header>

      {/* AI 분석 결과 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg z-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{i18n.language === 'ko' ? '병원을 찾고 있습니다...' : 'Finding hospitals...'}</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-200">{error}</div>
        ) : recommendations ? (
          <>
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏥</span>
                <div>
                  <div className="text-sm opacity-90">
                    {i18n.language === 'ko' ? '추천 진료과' : 'Recommended Department'}
                  </div>
                  <div className="font-bold text-lg">
                    {translateDepartment(recommendations.recommended_department)}
                  </div>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium shadow-md ${getUrgencyColor(recommendations.urgency_level)}`}
              >
                {getUrgencyLabel(recommendations.urgency_level)}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-2 text-center max-w-xl mx-auto">
              💡 {i18n.language === 'ko' ? recommendations.reason_kr : recommendations.reason_en}
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🏥</span>
            <span>{i18n.language === 'ko' ? '병원을 추천해드립니다' : 'We recommend hospitals for you'}</span>
          </div>
        )}
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 relative">
        <div id="kakao-map" className="w-full h-full" style={{ minHeight: '400px' }} />
        
        {/* 로딩 오버레이 */}
        {(isLoading || !mapLoaded) && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        )}
      </div>

      {/* 병원 상세 모달 */}
      {selectedHospital && (
        <>
          {/* 반투명 오버레이 */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] animate-fadeIn"
            onClick={() => setSelectedHospital(null)}
          />

          {/* 모달 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="bg-yellow-50 rounded-t-2xl p-6 border-b-2 border-yellow-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedHospital.name}</h2>
                    <p className="text-sm text-gray-500">{selectedHospital.department}</p>
                  </div>
                  <button
                    onClick={() => setSelectedHospital(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-4 p-1"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* 본문 */}
              <div className="p-6">
                {/* 진료 시간 */}
                <div className="mb-6 text-center">
                  <p className="text-gray-600 text-sm">
                    🕐 Clinic Hours: Mon-Sat, 10:00 - 18:00
                  </p>
                </div>

                {/* 상세 정보 박스 */}
                <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-4">
                  {/* 거리 및 진료과 */}
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl flex-shrink-0">📍</span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">
                        {i18n.language === 'ko' ? '위치 및 진료과' : 'Location & Department'}
                      </div>
                      <div className="font-medium text-gray-800">
                        {selectedHospital.distance} | {selectedHospital.department}
                      </div>
                    </div>
                  </div>

                  {/* 전화번호 */}
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 text-xl flex-shrink-0">📞</span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">
                        {i18n.language === 'ko' ? '전화번호' : 'Phone'}
                      </div>
                      <div className="font-medium text-gray-800">
                        {selectedHospital.phone || (i18n.language === 'ko' ? '정보 없음' : 'N/A')}
                      </div>
                    </div>
                  </div>

                  {/* 주소 */}
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl flex-shrink-0">📌</span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">
                        {i18n.language === 'ko' ? '주소' : 'Address'}
                      </div>
                      <div className="text-sm text-gray-700">{selectedHospital.address}</div>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-xl font-medium shadow-lg"
                    onClick={() => {
                      if (selectedHospital.phone) {
                        window.location.href = `tel:${selectedHospital.phone}`;
                      } else {
                        alert(i18n.language === 'ko' ? '전화번호 정보가 없습니다.' : 'No phone number available.');
                      }
                    }}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {i18n.language === 'ko' ? '전화하기' : 'Call'}
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl font-medium shadow-lg"
                    onClick={() => {
                      if (selectedHospital.url) {
                        window.open(selectedHospital.url, '_blank');
                      } else {
                        const kakaoMapUrl = `https://map.kakao.com/link/map/${selectedHospital.name},${selectedHospital.y},${selectedHospital.x}`;
                        window.open(kakaoMapUrl, '_blank');
                      }
                    }}
                  >
                    <MapIcon className="h-5 w-5 mr-2" />
                    {i18n.language === 'ko' ? '길찾기' : 'Directions'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
