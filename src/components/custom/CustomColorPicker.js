import React, { useState } from "react";
import { SketchPicker } from "react-color";
import "./CustomColorPicker.css";

export default function CustomColorPicker({ color, onChange }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setCurrentColor(color.hex);
    onChange(color.hex); // Prosleđivanje nove boje roditeljskoj komponenti
  };

  return (
    <div>
      <div className="color-swatch-background" onClick={handleClick}>
        <div className="color-swatch" style={{ background: currentColor }} />
      </div>
      {displayColorPicker ? (
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <SketchPicker color={currentColor} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
}
