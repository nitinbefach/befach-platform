/**
 * UI Components Index
 *
 * Re-export all UI components for easier imports
 */

// Existing components
export { default as Modal } from './Modal';
export { default as StatCard } from './StatCard';
export { default as FeatureCard } from './FeatureCard';
export { default as DataTable } from './DataTable';
export { default as DarkModeToggle } from './DarkModeToggle';
export { default as Logo } from './Logo';
export { ThemeProvider, useTheme } from './ThemeProvider';

// Animation components
export {
  AnimatedContainer,
  AnimatedList,
  AnimatedListItem,
  FadeIn,
  SlideUp,
  ScaleIn
} from './AnimatedContainer';

// Page transition components
export {
  PageTransition,
  AnimatedPage,
  StaggeredContent,
  StaggeredItem
} from './PageTransition';

// Skeleton loaders
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  SkeletonStats,
  SkeletonList,
  SkeletonForm,
  SkeletonPage,
  SkeletonPulse
} from './Skeleton';

// Loading indicators
export {
  Spinner,
  LoadingDots,
  ProgressBar,
  IndeterminateProgress,
  LoadingOverlay,
  FullPageLoader,
  ButtonLoader,
  PulseLoader
} from './LoadingIndicator';

// Animated cards
export {
  AnimatedCard,
  CardGrid,
  InteractiveCard
} from './AnimatedCard';

// Bottom sheet modal
export {
  BottomSheet,
  BottomSheetActions
} from './BottomSheet';

// Animated buttons
export {
  AnimatedButton,
  IconButton,
  FloatingActionButton
} from './AnimatedButton';

// Animated inputs
export {
  AnimatedInput,
  AnimatedTextarea,
  SearchInput
} from './AnimatedInput';
