type Props = {
  title: string;
}
export const Title = ({ title }: Props) => {
  return (
    <h1 className="text-xl font-bold">{title}</h1>
  )
}