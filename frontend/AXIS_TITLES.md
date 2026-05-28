# Axis Titles Implementation

## Overview
Professional axis titles have been added to all charts in the premium forecasting dashboard with full theme adaptation and optimal readability.

## Axis Title Specifications

### X-Axis Title
- **Label**: "Tanggal" (Date)
- **Position**: Below the date labels
- **Styling**: 
  - Font size: 14px (larger than tick labels at 12px)
  - Font weight: 600 (semibold)
  - Vertical offset: -10px for optimal spacing
  - Modern typography: system-ui, -apple-system, sans-serif

### Y-Axis Title
- **Label**: "Harga (Rp)" (Price in Rupiah)
- **Position**: Left side, rotated vertically (-90 degrees)
- **Styling**:
  - Font size: 14px (larger than tick labels at 12px)
  - Font weight: 600 (semibold)
  - Horizontal offset: 10px for optimal positioning
  - Rotation: -90 degrees for standard vertical axis label
  - Modern typography: system-ui, -apple-system, sans-serif

## Color Adaptation

### Light Mode
- Text color: `#1F2937` (dark gray)
- High contrast with white background
- Professional and clean appearance
- Excellent readability (WCAG AA compliant)

### Dark Mode
- Text color: `#E5E7EB` (light gray)
- High contrast with dark background
- Premium appearance with optimal visibility
- Maintains readability in all lighting conditions

## Chart Margins
The component includes optimized margins to accommodate axis titles:
- **Top margin**: 20px
- **Right margin**: 30px
- **Left margin**: 60px (for Y-axis title space)
- **Bottom margin**: 60px (for X-axis title space)
- **XAxis height**: 70px (provides sufficient space for title)

## Charts with Axis Titles

### 1. Historical Chart ("Grafik Harga Historis")
- Shows only historical price data
- Both axis titles prominently displayed
- Interactive tooltip on hover

### 2. Forecast Chart ("Grafik Forecast (Historis + Prediksi)")
- Combines historical and predicted data
- Both axis titles clearly labeled
- Legend shows data sources
- Visual distinction between historical (solid line) and forecast (dashed line)

## Technical Implementation

### Component: `premium-chart.tsx`
```tsx
import { Label } from 'recharts'

// X-Axis with title
<XAxis
  dataKey="date"
  height={70}
>
  <Label
    value="Tanggal"
    position="insideBottom"
    offset={-10}
    fill={currentColors.textLabel}
    fontSize={14}
    fontWeight={600}
  />
</XAxis>

// Y-Axis with title
<YAxis width={80}>
  <Label
    value="Harga (Rp)"
    angle={-90}
    position="insideLeft"
    offset={10}
    fill={currentColors.textLabel}
    fontSize={14}
    fontWeight={600}
  />
</YAxis>
```

## Design Benefits

✓ **Professional Appearance**: Clearly labeled axes enhance dashboard credibility
✓ **Improved Readability**: Users instantly understand what each axis represents
✓ **Consistency**: Both charts use identical axis label styling
✓ **Theme Aware**: Colors automatically adapt to light/dark modes
✓ **Accessibility**: Proper contrast and sizing meet WCAG standards
✓ **Modern Design**: Clean typography with appropriate sizing hierarchy

## Future Enhancements

- Consider adding unit abbreviations on axis ticks (e.g., "28k" vs "28.000")
- Add axis gridline labels for easier value reading
- Implement custom axis formatting for very large datasets
