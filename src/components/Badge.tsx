interface BadgeProps {
  children: React.ReactNode;
}

const Badge = ({ children }: BadgeProps) => {
  return (
    <span className="bg-muted py-1 px-2 rounded-lg text-muted-foreground border font-medium cursor-pointer text-sm">
      {children}
    </span>
  );
};

export default Badge;
