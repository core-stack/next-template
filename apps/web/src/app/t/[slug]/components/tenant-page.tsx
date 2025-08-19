
type Props = {
  children: React.ReactNode;
  title: string;
}
export const TenantPage = ({ children, title }: Props) => {
  return (
    <>
      <h1 className="text-3xl font-bold">{title}</h1>
      {children}
    </>
  )
}