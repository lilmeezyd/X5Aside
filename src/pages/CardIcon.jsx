import React from 'react'

export default function CardIcon({ type = "yellow" }) {
  const color = type === "red" ? "#e53935" : "#fdd835";

  return (
    <div
      style={{
        width: "16px",
        height: "22px",
        backgroundColor: color,
        borderRadius: "2px",
        border: "1px solid #333",
      }}
      title={type === "red" ? "Red Card" : "Yellow Card"}
    />
  );
}
