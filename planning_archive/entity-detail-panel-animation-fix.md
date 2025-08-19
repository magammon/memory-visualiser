# EntityDetailPanel Slide-Out Animation - Junior Implementation Guide

## Problem
The EntityDetailPanel currently appears/disappears instantly. We need to add a smooth slide-in from the right animation.

## Project Context
- We're using **React + TypeScript** with **Tailwind CSS**
- The EntityDetailPanel component is in `src/components/`
- This follows our KISS principle - simple CSS animations, no extra libraries

## Solution Overview
Use CSS transforms + React state for a smooth 300ms slide animation from the right side of the screen.

## Implementation Steps

### Step 1: Add Required Imports
Add these imports to the top of `EntityDetailPanel.tsx`:
```typescript
import { useState, useEffect } from 'react';
```

### Step 2: Add Animation State
Inside the component, add this state variable:
```typescript
const [isVisible, setIsVisible] = useState(false);
```

### Step 3: Add Slide-In Animation
Add this `useEffect` to trigger the slide-in when component mounts:
```typescript
useEffect(() => {
  const timer = setTimeout(() => setIsVisible(true), 10);
  return () => clearTimeout(timer);
}, []);
```

### Step 4: Update the CSS Classes
Replace the current `className` with:
```typescript
className={`
  w-80 bg-obsidian-surface border-l border-obsidian-border flex flex-col
  transform transition-transform duration-300 ease-out
  ${isVisible ? 'translate-x-0' : 'translate-x-full'}
`}
```

### Step 5: Update Close Handler
Replace any `onClose()` calls with this new handler:
```typescript
const handleClose = () => {
  setIsVisible(false);
  setTimeout(onClose, 300); // Wait for animation to finish
};
```

### Step 6: Set Fixed Height
Add this style prop to prevent layout shifts:
```typescript
style={{ height: '100vh' }}
```

## How It Works
- `translate-x-full` = panel is off-screen to the right
- `translate-x-0` = panel is in its normal position
- `transition-transform duration-300` = smooth 300ms animation
- The 10ms delay ensures React has rendered the DOM before starting animation

## Testing Your Changes

### Quick Test
1. Click any graph node → panel should slide in from the right
2. Click close button → panel should slide out to the right
3. Try clicking rapidly → no weird animation glitches

### Run the Development Server
```bash
npm run dev:full
```
Open `http://localhost:3000` and test the graph interaction.

## Complete Code Example

Your final component should look like this:
```typescript
import { useState, useEffect } from 'react';

export const EntityDetailPanel: React.FC<EntityDetailPanelProps> = ({ node, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`
        w-80 bg-obsidian-surface border-l border-obsidian-border flex flex-col
        transform transition-transform duration-300 ease-out
        ${isVisible ? 'translate-x-0' : 'translate-x-full'}
      `}
      style={{ height: '100vh' }}
    >
      {/* Replace any onClose() calls in your content with handleClose() */}
    </div>
  );
};
```

## Quality Check
After implementing, run:
```bash
npm run lint
npm run build
```
Both should pass without errors.

## Need Help?
- Check existing components in `src/components/` for similar patterns
- The project uses Tailwind CSS classes for styling
- React hooks (useState, useEffect) handle the animation timing