import type { ReactNode } from 'react';

type SettingsSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className='space-y-4'>
      <div>
        <h2 className='text-base font-semibold'>{title}</h2>

        <p className='text-muted-foreground mt-1 text-sm'>{description}</p>
      </div>

      {children}
    </section>
  );
}
