import { redirect } from 'next/navigation';

export default function NewCalculationRedirect() {
  redirect('/cost-calculator/new/step-1');
}