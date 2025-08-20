type Props = {
  title: string;
}
export const PageTitle = ({ title }: Props) => {
  return (
    <h1 className="text-3xl font-bold">{title}</h1>
  )
}