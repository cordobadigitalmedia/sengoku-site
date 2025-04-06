import Link from "next/link"

export default async function NotFound() {
  return (
    <div>
      <h2>Page not found</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/">Sengoku Martials Arts Home</Link>
      </p>
    </div>
  )
}
