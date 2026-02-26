import Link from "next/link"

import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { GoogleMap } from "@/components/ui/iframe-googlemap"
import { VideoPlayer } from "@/components/ui/iframe-video"

const mdxComponents: MDXRemoteProps["components"] = {
  Youtube: (props: { id?: string }) => (
    <VideoPlayer url={`https://www.youtube.com/embed/${props.id ?? ""}`} />
  ),
  Googlemap: (props: { src?: string }) => <GoogleMap url={props.src ?? ""} />,
  Alert: (props: { title?: string; description?: string; type?: string }) => (
    <p>
      <Alert
        variant={props.type === "info" ? "default" : "destructive"}
        className="my-3"
      >
        <AlertTitle>{props.title}</AlertTitle>
        <AlertDescription>{props.description}</AlertDescription>
      </Alert>
    </p>
  ),
  Button: (props: { title?: string; link?: string }) => (
    <Link href={props.link ?? ""}>
      <Button>{props.title ?? ""}</Button>
    </Link>
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const href = props.href ?? ""
    if (
      href.toLowerCase().startsWith("https") ||
      href.toLowerCase().startsWith("mailto:") ||
      href.toLowerCase().endsWith(".pdf")
    ) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
      )
    }
    return <Link href={href} {...props} className="my-3" />
  },
}

type MdxContentProps = {
  source: string
}

export async function MdxContent({ source }: MdxContentProps) {
  return await MDXRemote({ source, components: mdxComponents })
}
