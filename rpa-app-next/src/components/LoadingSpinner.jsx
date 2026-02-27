 "use client";
 
 import React from "react";
 import { Loader2 } from "lucide-react";
 
 export default function LoadingSpinner({ fullScreen = true, message }) {
   const containerStyle = fullScreen
     ? {
         display: "flex",
         flexDirection: "column",
         alignItems: "center",
         justifyContent: "center",
         height: "100vh",
         width: "100vw",
         backgroundColor: "var(--bg-main)",
       }
     : {
         display: "flex",
         flexDirection: "column",
         alignItems: "center",
         justifyContent: "center",
         padding: "48px 24px",
         height: "100%",
       };
 
   return (
     <div style={containerStyle}>
       <div style={{ position: "relative", width: 64, height: 64 }}>
         <div
           style={{
             position: "absolute",
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             border: "4px solid var(--glass-border)",
             borderRadius: "50%",
             opacity: 0.3,
           }}
         />
         <div
           style={{
             position: "absolute",
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             border: "4px solid transparent",
             borderTopColor: "var(--accent-primary)",
             borderRadius: "50%",
             animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
           }}
         />
         <div
           style={{
             position: "absolute",
             top: 12,
             left: 12,
             right: 12,
             bottom: 12,
             border: "4px solid transparent",
             borderBottomColor: "var(--accent-secondary, #60a5fa)",
             borderRadius: "50%",
             animation:
               "spin 1.5s cubic-bezier(0.2, 0.4, 0.8, 0.6) infinite reverse",
           }}
         />
       </div>
 
       {message && (
         <div
           style={{
             marginTop: 16,
             fontSize: 14,
             color: "var(--text-secondary)",
           }}
         >
           {message}
         </div>
       )}
 
       <div
         style={{
           marginTop: 32,
           width: 120,
           height: 6,
           backgroundColor: "var(--glass-border)",
           borderRadius: 8,
           overflow: "hidden",
           position: "relative",
         }}
       >
         <div
           style={{
             position: "absolute",
             top: 0,
             left: 0,
             height: "100%",
             width: "40%",
             backgroundColor: "var(--accent-primary)",
             borderRadius: 8,
             animation: "shimmer 1.5s infinite ease-in-out",
             transform: "translateX(-100%)",
           }}
         />
       </div>
 
       <style>{`
         @keyframes shimmer {
           0% { transform: translateX(-150%); }
           100% { transform: translateX(350%); }
         }
         @keyframes spin {
           0% { transform: rotate(0deg); }
           100% { transform: rotate(360deg); }
         }
       `}</style>
     </div>
   );
 }

