"use client";

import { ReactNode } from "react";

interface MobileFrameProps {
  title: string;
  icon: string;
  color: "blue" | "gray" | "purple";
  children: ReactNode;
}

const colorStyles = {
  blue: {
    accent: "bg-blue-500",
    text: "text-blue-400",
  },
  gray: {
    accent: "bg-neutral-800",
    text: "text-neutral-300",
  },
  purple: {
    accent: "bg-purple-500",
    text: "text-purple-400",
  },
};

export default function MobileFrame({ title, icon, color, children }: MobileFrameProps) {
  const styles = colorStyles[color];

  return (
    <div className="flex flex-col items-center">
      {/* 플랫폼 라벨 */}
      <div className={`flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10`}>
        <span className="text-base">{icon}</span>
        <span className={`text-sm font-medium ${styles.text}`}>{title}</span>
      </div>

      {/* 아이폰 프레임 - iPhone 15 Pro 비율 (393:852 = 1:2.168) */}
      <div className="relative">
        {/* 외부 프레임 (스테인리스 스틸 느낌) */}
        <div
          className="relative w-[340px] h-[737px] rounded-[55px] p-[12px]"
          style={{
            background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.1),
              0 25px 50px -12px rgba(0,0,0,0.8),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
          }}
        >
          {/* 내부 스크린 */}
          <div
            className="relative w-full h-full rounded-[44px] overflow-hidden"
            style={{
              background: "#000",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Dynamic Island - 실제 비율 (126 x 37pt 기준) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div
                className="w-[110px] h-[34px] bg-black rounded-full flex items-center justify-center"
                style={{
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
                }}
              >
                {/* 카메라 */}
                <div className="w-3 h-3 rounded-full bg-[#1a1a1a] border border-[#0a0a0a] mr-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]/30 m-0.5" />
                </div>
              </div>
            </div>

            {/* 상태바 */}
            <div className="absolute top-3 left-0 right-0 z-10 px-8 flex justify-between items-center text-white text-xs font-medium">
              {/* 시간 */}
              <span className="w-12 text-center">9:41</span>

              {/* 우측 아이콘들 */}
              <div className="flex items-center gap-1.5">
                {/* 셀룰러 */}
                <svg className="w-4 h-3" viewBox="0 0 18 12" fill="white">
                  <rect x="0" y="6" width="3" height="6" rx="0.5" fillOpacity="0.3"/>
                  <rect x="4" y="4" width="3" height="8" rx="0.5" fillOpacity="0.5"/>
                  <rect x="8" y="2" width="3" height="10" rx="0.5" fillOpacity="0.7"/>
                  <rect x="12" y="0" width="3" height="12" rx="0.5"/>
                </svg>
                {/* WiFi */}
                <svg className="w-4 h-3" viewBox="0 0 16 12" fill="white">
                  <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
                  <path d="M4.5 7.5c1.9-1.9 5.1-1.9 7 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <path d="M2 5c3.3-3.3 8.7-3.3 12 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
                {/* 배터리 */}
                <div className="flex items-center">
                  <div className="w-6 h-3 rounded-[3px] border border-white/50 relative">
                    <div className="absolute inset-[2px] rounded-[1px] bg-white" style={{ width: "75%" }} />
                  </div>
                  <div className="w-[3px] h-1.5 bg-white/50 rounded-r-sm ml-[1px]" />
                </div>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="absolute inset-0 pt-14 pb-8 px-3">
              <div className="h-full overflow-y-auto custom-scrollbar rounded-2xl">
                {children}
              </div>
            </div>

            {/* 홈 인디케이터 - 실제 비율 (134 x 5pt 기준) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="w-[120px] h-[5px] bg-white/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* 사이드 버튼들 - iPhone 15 Pro 위치 기준 */}
        {/* 무음 스위치 */}
        <div
          className="absolute left-[-2px] top-[120px] w-[3px] h-7 rounded-l-sm"
          style={{ background: "linear-gradient(to bottom, #3a3a3a, #2a2a2a)" }}
        />
        {/* 볼륨 업 */}
        <div
          className="absolute left-[-2px] top-[170px] w-[3px] h-12 rounded-l-sm"
          style={{ background: "linear-gradient(to bottom, #3a3a3a, #2a2a2a)" }}
        />
        {/* 볼륨 다운 */}
        <div
          className="absolute left-[-2px] top-[230px] w-[3px] h-12 rounded-l-sm"
          style={{ background: "linear-gradient(to bottom, #3a3a3a, #2a2a2a)" }}
        />
        {/* 전원 버튼 */}
        <div
          className="absolute right-[-2px] top-[180px] w-[3px] h-[70px] rounded-r-sm"
          style={{ background: "linear-gradient(to bottom, #3a3a3a, #2a2a2a)" }}
        />
      </div>
    </div>
  );
}
