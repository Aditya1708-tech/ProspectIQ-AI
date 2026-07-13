/**
 * ProspectIQ AI - Centralized IDBI Bank Brand Design Tokens
 * 
 * These tokens define the official color language, typography guidelines,
 * and component styles for the IDBI Bank Innovate Hackathon Final UI.
 */

export const IDBI_THEME = {
  colors: {
    // Official IDBI Brand Colors
    primaryGreen: '#00836C',   // dominant navbar green
    darkGreen: '#006B58',      // sidebar, hover state, active menu items, headers
    lightGreen: '#EAF6F3',     // selected tabs, active cards, hover backgrounds
    accentOrange: '#F58220',    // CTA buttons, alerts, KPI highlights, active indicators
    orangeHover: '#D96B12',     // CTA button hover state
    
    // Interface Colors
    bg: '#F7F9FA',             // page background
    card: '#FFFFFF',           // container / card background
    border: '#D9E4E1',         // table and card borders
    
    // Typography Colors
    primaryText: '#222222',    // high-contrast content text
    secondaryText: '#6A737D',  // secondary content descriptions / labels
    
    // Status Colors (Enterprise Banking standards)
    success: '#2AA85A',        // healthy, completed, growing
    warning: '#F5A623',        // warning, pending
    error: '#D64545',          // immediate action, overdue, risks
    info: '#2F80ED',           // informational overlays
  },
  
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    weights: {
      heading: '600',
      body: '400',
    }
  },
  
  borderRadius: {
    card: '14px',             // Soft banking interface card roundness
  },
  
  shadows: {
    card: '0 4px 12px rgba(0, 131, 108, 0.04)', // Subtle enterprise green shadow
    button: '0 2px 4px rgba(245, 130, 32, 0.2)', // Orange CTA shadow
  }
};
