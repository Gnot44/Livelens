import React, { useRef, useState, useEffect, memo } from "react";
import "../styles/vcontainer.css"; // นำเข้า CSS
import { Box, Typography, IconButton } from "@mui/material";
import Hls from "hls.js";
import CloseIcon from "@mui/icons-material/Close";

const VideoContainer = ({ blockId, streamName: initialStreamName }) => {
    const videoRef = useRef(null);
    const [url, setUrl] = useState(null);
    const [error, setError] = useState(null);
    const [streamName, setStreamName] = useState(null);

    useEffect(() => {
        const savedVideos = JSON.parse(localStorage.getItem("videos")) || {};
        if (savedVideos[blockId]) {
            loadVideo(savedVideos[blockId].url, savedVideos[blockId].name);
        }

        return () => {
            if (videoRef.current) videoRef.current.pause();
        };
    }, [blockId]);

    const loadVideo = (videoUrl, name) => {
        if (!videoUrl || !videoUrl.trim()) {
            setError("Invalid URL provided");
            return;
        }
    
        const video = videoRef.current;
        setError(null);
    
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.muted = true; // ทำให้วิดีโอเล่นอัตโนมัติได้
                video.play().catch((err) => console.error("Autoplay failed:", err));
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoUrl;
            video.muted = true; // ทำให้วิดีโอเล่นอัตโนมัติได้
            video.play().catch((err) => console.error("Autoplay failed:", err));
        } else {
            setError("Browser does not support HLS.");
        }
    
        setUrl(videoUrl);
        setStreamName(name); // อัปเดตชื่อ
        saveVideoToLocalStorage(blockId, videoUrl, name);
    };
    

    const saveVideoToLocalStorage = (blockId, videoUrl, name) => {
        const savedVideos = JSON.parse(localStorage.getItem("videos")) || {};
        savedVideos[blockId] = { url: videoUrl, name };
        localStorage.setItem("videos", JSON.stringify(savedVideos));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedUrl = e.dataTransfer.getData("url");
        const droppedName = e.dataTransfer.getData("name") || "Unknown Stream";

        if (!droppedUrl || !droppedUrl.trim()) {
            setError("Dropped URL is invalid or empty");
            return;
        }

        loadVideo(droppedUrl, droppedName);
    };

    const handleReset = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.src = "";
            videoRef.current.load();
        }
        setUrl(null);
        setError(null);
        setStreamName(null);

        const savedVideos = JSON.parse(localStorage.getItem("videos")) || {};
        delete savedVideos[blockId];
        localStorage.setItem("videos", JSON.stringify(savedVideos));
    };

    return (
        <Box
            className="video-container"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            {/* ชื่อ Stream บนมุมบนซ้าย */}
            <Typography className="stream-name">{streamName}</Typography>

            {!url && (
                <Typography sx={{ color: "#aaa" }}>
                    ลากและวางที่นี่
                </Typography>
            )}
            {error && <Typography className="error-message">{error}</Typography>}
            {url && (
                <IconButton className="reset-button" onClick={handleReset}>
                    <CloseIcon />
                </IconButton>
            )}
            <video
                ref={videoRef}
                controls
                muted
                autoPlay
                className={url ? "active" : ""}
            />
        </Box>
    );
};

export default memo(VideoContainer);
