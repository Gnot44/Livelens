import React, { memo } from "react";
import { Drawer, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import { ChevronLeft, ChevronRight, GridView, Splitscreen, FiberManualRecord } from "@mui/icons-material";
import "../styles/sidebar.css"; // Import CSS จากโฟลเดอร์ /styles

const Sidebar = ({ open, streams, onDragStart, toggleSidebar, setMode }) => {
    return (
        <Drawer
            anchor="left"
            open
            variant="persistent"
            className="drawer"
            sx={{
                width: open ? 170 : 40,
                "& .MuiDrawer-paper": { width: open ? 170 : 40 },
            }}
        >
            <Box className={`drawer-header ${!open && "drawer-header-closed"}`}>
                {/* ข้อความรายงานสด */}
                {open && (
                    <Box className="live-indicator">
                        <FiberManualRecord sx={{ fontSize: 16 }} />
                        รายงานสด
                    </Box>
                )}
                {/* IconButton */}
                <IconButton onClick={toggleSidebar} color="inherit">
                    {open ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
            </Box>

            {/* Streams */}
            {open && (
                <List sx={{ flex: 1 }}>
                    {streams.map((stream, index) => (
                        <ListItem
                            key={index}
                            draggable
                            onDragStart={(e) => onDragStart(e, stream.url, stream.name)}
                            className="list-item"
                        >
                            <ListItemText primary={stream.name} />
                        </ListItem>

                    ))}
                </List>
            )}

            {/* Footer Icons */}
            <Box className="drawer-footer">
                {/* ปุ่มเลือกโหมด 2 จอ */}
                <IconButton onClick={() => setMode("2")} className="icon-button">
                    <Splitscreen />
                </IconButton>

                {/* ปุ่มเลือกโหมด 4 จอ */}
                <IconButton onClick={() => setMode("4")} className="icon-button">
                    <GridView />
                </IconButton>
            </Box>
        </Drawer>
    );
};

export default memo(Sidebar);
