# React Icons Library Reference

**Website:** https://react-icons.github.io/react-icons/
**Last Updated:** December 2024

## Overview

React Icons provides popular icon sets as React components using ES6 imports. It ensures only the icons you use are included in your bundle through tree-shaking.

## Installation

### Standard Installation
```bash
npm install react-icons --save
# or
yarn add react-icons
# or
pnpm add react-icons
```

### Alternative for Large Projects
```bash
npm install @react-icons/all-files --save
```
*Use this for frameworks like MeteorJS, Gatsby, or when you need direct file imports*

## Available Icon Libraries

| Library | Import Path | Icon Count | Example Import |
|---------|------------|------------|----------------|
| Ant Design Icons | `react-icons/ai` | 789+ | `import { AiFillHome } from 'react-icons/ai'` |
| Bootstrap Icons | `react-icons/bs` | 2,716+ | `import { BsBootstrap } from 'react-icons/bs'` |
| BoxIcons | `react-icons/bi` | 1,500+ | `import { BiHome } from 'react-icons/bi'` |
| Circum Icons | `react-icons/ci` | 288+ | `import { CiSearch } from 'react-icons/ci'` |
| CSS.gg | `react-icons/cg` | 704+ | `import { CgProfile } from 'react-icons/cg'` |
| Feather Icons | `react-icons/fi` | 287+ | `import { FiSearch } from 'react-icons/fi'` |
| Flat Color Icons | `react-icons/fc` | 329+ | `import { FcGoogle } from 'react-icons/fc'` |
| Font Awesome 5 | `react-icons/fa` | 1,600+ | `import { FaReact } from 'react-icons/fa'` |
| Font Awesome 6 | `react-icons/fa6` | 2,048+ | `import { FaGithub } from 'react-icons/fa6'` |
| Game Icons | `react-icons/gi` | 4,040+ | `import { GiSword } from 'react-icons/gi'` |
| Github Octicons | `react-icons/go` | 264+ | `import { GoMarkGithub } from 'react-icons/go'` |
| Grommet Icons | `react-icons/gr` | 635+ | `import { GrGoogle } from 'react-icons/gr'` |
| Heroicons | `react-icons/hi` | 230+ | `import { HiHome } from 'react-icons/hi'` |
| Heroicons 2 | `react-icons/hi2` | 592+ | `import { HiHome } from 'react-icons/hi2'` |
| Icons8 Line Awesome | `react-icons/lia` | 1,544+ | `import { LiaHomeSolid } from 'react-icons/lia'` |
| Iconoir | `react-icons/io` | 1,500+ | `import { IoHome } from 'react-icons/io'` |
| Ionicons 5 | `react-icons/io5` | 1,356+ | `import { IoHomeOutline } from 'react-icons/io5'` |
| Lucide | `react-icons/lu` | 1,500+ | `import { LuHome } from 'react-icons/lu'` |
| Material Design Icons | `react-icons/md` | 4,341+ | `import { MdHome } from 'react-icons/md'` |
| Phosphor Icons | `react-icons/pi` | 9,072+ | `import { PiHouseFill } from 'react-icons/pi'` |
| Radix Icons | `react-icons/rx` | 318+ | `import { RxHome } from 'react-icons/rx'` |
| Remix Icons | `react-icons/ri` | 2,880+ | `import { RiHomeLine } from 'react-icons/ri'` |
| Simple Icons | `react-icons/si` | 3,275+ | `import { SiReact } from 'react-icons/si'` |
| Simple Line Icons | `react-icons/sl` | 189+ | `import { SlHome } from 'react-icons/sl'` |
| Tabler Icons | `react-icons/tb` | 5,754+ | `import { TbHome } from 'react-icons/tb'` |
| Typicons | `react-icons/ti` | 336+ | `import { TiHome } from 'react-icons/ti'` |
| VS Code Icons | `react-icons/vsc` | 461+ | `import { VscHome } from 'react-icons/vsc'` |
| Weather Icons | `react-icons/wi` | 219+ | `import { WiDaySunny } from 'react-icons/wi'` |

## Basic Usage

### Simple Implementation
```jsx
import { FaBeer } from 'react-icons/fa';

function MyComponent() {
  return (
    <div>
      <h3>Let's go for a <FaBeer />?</h3>
    </div>
  );
}
```

### With Custom Styling
```jsx
import { FaReact } from 'react-icons/fa';

function StyledIcon() {
  return (
    <FaReact
      size={30}
      color="#61dafb"
      className="react-icon"
      style={{ marginRight: '10px' }}
    />
  );
}
```

### Using IconContext Provider
```jsx
import { IconContext } from "react-icons";
import { FaFolder } from 'react-icons/fa';

function App() {
  return (
    <IconContext.Provider value={{ color: "blue", size: "2em", className: "global-class-name" }}>
      <div>
        <FaFolder />
      </div>
    </IconContext.Provider>
  );
}
```

## Common Props

| Prop | Type | Description |
|------|------|-------------|
| `color` | string | Icon color (CSS color value) |
| `size` | string/number | Icon size (e.g., "1.5em", 24) |
| `className` | string | CSS class name |
| `style` | object | Inline styles |
| `title` | string | Accessibility title |

## Best Practices

### 1. Import Only What You Need
```jsx
// Good - specific imports
import { FaHome, FaUser, FaSettings } from 'react-icons/fa';

// Avoid - importing entire library
import * as FaIcons from 'react-icons/fa';
```

### 2. Create Reusable Icon Components
```jsx
// components/Icons.jsx
import { FaHome, FaUser, FaSettings } from 'react-icons/fa';
import { MdDashboard, MdNotifications } from 'react-icons/md';

export const HomeIcon = (props) => <FaHome {...props} />;
export const UserIcon = (props) => <FaUser {...props} />;
export const SettingsIcon = (props) => <FaSettings {...props} />;
export const DashboardIcon = (props) => <MdDashboard {...props} />;
export const NotificationIcon = (props) => <MdNotifications {...props} />;
```

### 3. Consistent Sizing with Context
```jsx
import { IconContext } from "react-icons";

function Navigation() {
  return (
    <IconContext.Provider value={{ size: "1.5em" }}>
      <nav>
        <HomeIcon />
        <UserIcon />
        <SettingsIcon />
      </nav>
    </IconContext.Provider>
  );
}
```

### 4. Accessibility
```jsx
// Add descriptive titles for screen readers
<FaHome title="Home" aria-label="Go to home page" />

// Or use with text
<button>
  <FaHome aria-hidden="true" />
  <span>Home</span>
</button>
```

## TypeScript Support

React Icons includes TypeScript definitions:

```tsx
import { IconType } from 'react-icons';
import { FaHome } from 'react-icons/fa';

interface ButtonWithIconProps {
  icon: IconType;
  label: string;
}

function ButtonWithIcon({ icon: Icon, label }: ButtonWithIconProps) {
  return (
    <button>
      <Icon />
      <span>{label}</span>
    </button>
  );
}

// Usage
<ButtonWithIcon icon={FaHome} label="Home" />
```

## Performance Tips

1. **Use tree-shaking**: Import icons individually to minimize bundle size
2. **Lazy load icon sets**: For large applications, consider code-splitting
3. **Use @react-icons/all-files**: For better performance in SSR/SSG environments
4. **Cache commonly used icons**: Create a central icons file for frequently used icons

## Common Use Cases

### Navigation Menu
```jsx
import { FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { icon: FaHome, label: 'Home', path: '/' },
  { icon: FaUser, label: 'Profile', path: '/profile' },
  { icon: FaCog, label: 'Settings', path: '/settings' },
  { icon: FaSignOutAlt, label: 'Logout', path: '/logout' },
];
```

### Social Media Links
```jsx
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const socialLinks = [
  { icon: FaFacebook, url: 'https://facebook.com/...' },
  { icon: FaTwitter, url: 'https://twitter.com/...' },
  { icon: FaInstagram, url: 'https://instagram.com/...' },
  { icon: FaLinkedin, url: 'https://linkedin.com/...' },
];
```

### Status Indicators
```jsx
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const StatusIcon = ({ status }) => {
  switch(status) {
    case 'success':
      return <FaCheckCircle color="green" />;
    case 'warning':
      return <FaExclamationCircle color="orange" />;
    case 'error':
      return <FaTimesCircle color="red" />;
    default:
      return null;
  }
};
```

## Troubleshooting

### Issue: Icons not showing
- Ensure react-icons is properly installed
- Check import paths are correct
- Verify the icon name exists in the library

### Issue: Bundle size too large
- Import icons individually, not entire libraries
- Consider using @react-icons/all-files package
- Implement code-splitting for icon-heavy components

### Issue: TypeScript errors
- Ensure @types/react is installed
- Update react-icons to latest version
- Use IconType for dynamic icon props

## Resources

- **Official Website**: https://react-icons.github.io/react-icons/
- **GitHub Repository**: https://github.com/react-icons/react-icons
- **NPM Package**: https://www.npmjs.com/package/react-icons
- **Icon Search**: Use the search feature on the official website to find specific icons

## Quick Command Reference

```bash
# Install
npm install react-icons --save

# Update to latest version
npm update react-icons

# Check installed version
npm list react-icons
```

---

*This documentation is stored for quick reference when implementing icon functionality in the project.*