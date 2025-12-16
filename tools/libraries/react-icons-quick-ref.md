# React Icons - Quick Reference

**URL:** https://react-icons.github.io/react-icons/

## Install
```bash
npm install react-icons --save
```

## Most Used Icon Sets

| Set | Import | Popular Icons |
|-----|--------|--------------|
| **Font Awesome** | `react-icons/fa` | FaHome, FaUser, FaSearch, FaBars, FaTimes, FaEdit, FaTrash |
| **Material Design** | `react-icons/md` | MdHome, MdPerson, MdSettings, MdMenu, MdClose, MdEdit |
| **Feather** | `react-icons/fi` | FiSearch, FiUser, FiSettings, FiMenu, FiX, FiEdit |
| **Heroicons 2** | `react-icons/hi2` | HiHome, HiUser, HiCog, HiBars3, HiXMark |
| **Bootstrap** | `react-icons/bs` | BsHouseFill, BsPerson, BsGear, BsList, BsX |
| **Phosphor** | `react-icons/pi` | PiHouse, PiUser, PiGear, PiList, PiX |

## Basic Usage
```jsx
import { FaHome, FaUser, FaSearch } from 'react-icons/fa';

// Simple use
<FaHome />

// With props
<FaHome size={24} color="#333" className="icon" />

// In button
<button>
  <FaSearch /> Search
</button>
```

## Common Patterns

### Navigation Icons
```jsx
import { FaHome, FaUser, FaCog, FaBell, FaSignOutAlt } from 'react-icons/fa';
```

### Social Media
```jsx
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGithub } from 'react-icons/fa';
```

### Actions
```jsx
import { FaEdit, FaTrash, FaPlus, FaSave, FaDownload, FaUpload, FaShare } from 'react-icons/fa';
```

### Status/Alerts
```jsx
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
```

### UI Controls
```jsx
import { FaBars, FaTimes, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
```

## Icon Context (Global Styling)
```jsx
import { IconContext } from "react-icons";

<IconContext.Provider value={{ size: "1.5em", color: "blue" }}>
  <div>
    <FaHome />  {/* All icons inherit these styles */}
    <FaUser />
  </div>
</IconContext.Provider>
```

## TypeScript
```tsx
import { IconType } from 'react-icons';
import { FaHome } from 'react-icons/fa';

interface Props {
  icon: IconType;
}

const Component = ({ icon: Icon }: Props) => <Icon />;
```

## Search for Icons
Visit: https://react-icons.github.io/react-icons/search

## Tips
- Import only what you need (tree-shaking)
- Create an icons.js file for commonly used icons
- Use IconContext for consistent styling
- Add `aria-label` or `title` for accessibility
- Icons are inline by default - wrap in flex/grid for alignment