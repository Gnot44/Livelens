import React, { useState, useCallback } from "react";
import Sidebar from "../components/sidebar";
import VideoContainer from "../components/VideoContainer";
import "../styles/global.css"; // นำเข้า CSS

export default function Home() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mode, setMode] = useState("4"); // โหมดเริ่มต้นเป็น 4 จอ

    const streams = [
        { name: "สำนักพิมพ์จุฬา-01", url: "http://34.135.22.194/hls/cam3/test.m3u8" },
        { name: "สำนักพิมพ์จุฬา-02", url: "http://34.135.22.194/hls/cam4/test1.m3u8" },
        { name: "โรงพิมพ์อาสารักษาดินแดน-01", url: "http://34.135.22.194/hls/cam5/test5.m3u8" },
        { name: "โรงพิมพ์อาสารักษาดินแดน-02", url: "http://34.135.22.194/hls/cam6/test6.m3u8" },
    ];

    streams.forEach((stream, index) => {
        if (!stream.url || !stream.url.trim()) {
            console.error(`Stream at index ${index} has an invalid URL`);
        }
    });


    const handleDragStart = useCallback((e, url, name) => {
        if (!url || !url.trim()) {
            console.error("Invalid URL provided for drag");
            return;
        }
        e.dataTransfer.setData("url", url);
        e.dataTransfer.setData("name", name || "Unknown Stream");
    }, []);



    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    return (
        <div className="container">
            <Sidebar
                streams={streams}
                open={sidebarOpen}
                onDragStart={handleDragStart}
                toggleSidebar={toggleSidebar}
                setMode={setMode}
            />
            <div className="video-container-wrapper">
                {[...Array(mode === "2" ? 2 : 4)].map((_, index) => {
                    const streamName = streams[index]?.name || `Stream ${index + 1}`;
                    return (
                        <div
                            key={index}
                            className={`video-container ${mode === "2" ? "two-screens" : ""}`}
                        >
                            <VideoContainer
                                blockId={`block${index + 1}`}
                                streamName={streamName}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}