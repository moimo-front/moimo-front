/**
 * ISO 날짜 문자열을 "YYYY. M. D(요일) HH:MM" 형식으로 변환
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2026. 1. 19(일) 14:30")
 */
export function formatMeetingDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}. ${month}. ${day}(${weekday}) ${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * ISO 날짜 문자열을 "HH:MM" 형식으로 변환
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns 포맷된 시간 문자열 (예: "14:30")
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}
