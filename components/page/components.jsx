import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import { GoogleMap } from "../ui/iframe-googlemap"
import { VideoPlayer } from "../ui/iframe-video"

export const components = {
  Youtube: (props) => {
    return <VideoPlayer url={`https://www.youtube.com/embed/${props.id}`} />
  },
  Googlemap: (props) => {
    return <GoogleMap url={props.src} />
  },
  Alert: (props) => {
    return (
      <p>
        <Alert
          variant={props.type === "info" ? "default" : "destructive"}
          className="my-3"
        >
          <AlertTitle>{props.title}</AlertTitle>
          <AlertDescription>{props.description}</AlertDescription>
        </Alert>
      </p>
    )
  },
  Button: (props) => {
    return (
      <Link href={props.link || ""}>
        <Button>{props.title || ""}</Button>
      </Link>
    )
  },
  a: (props) => {
    if (
      props.url &&
      (props.url.toLowerCase().startsWith("https") ||
        props.url.toLowerCase().startsWith("mailto:") ||
        props.url.toLowerCase().endsWith(".pdf"))
    ) {
      return (
        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {props.children}
        </a>
      )
    } else {
      return (
        <Link href={props.url} {...props} className="my-3">
          {props.children}
        </Link>
      )
    }
  },
}
